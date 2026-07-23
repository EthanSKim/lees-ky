from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import MenuCategory
from app.schemas import CategoryWithItemsResponse, MenuItemResponse

router = APIRouter(tags=["menu"])


@router.get("/menu", response_model=list[CategoryWithItemsResponse])
def get_menu(db: Session = Depends(get_db)):
    """Public menu, grouped by category, ordered for display.

    Only available items are returned here so the public site never shows
    something diners can't actually order; the admin view (see api/admin_menu.py)
    returns everything including unavailable items.
    """
    categories = (
        db.query(MenuCategory)
        .options(selectinload(MenuCategory.items))
        .order_by(MenuCategory.display_order)
        .all()
    )

    # Build response objects explicitly rather than mutating category.items directly:
    # that relationship has cascade="all, delete-orphan", so reassigning it would mark
    # filtered-out items for deletion on the next flush.
    result = []
    for category in categories:
        available_items = [item for item in category.items if item.is_available]
        if available_items:
            result.append(
                CategoryWithItemsResponse(
                    id=category.id,
                    name=category.name,
                    display_order=category.display_order,
                    items=[MenuItemResponse.model_validate(i) for i in available_items],
                )
            )
    return result
