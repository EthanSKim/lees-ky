from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.api.auth import get_current_admin
from app.database import get_db
from app.models import AdminUser, MenuCategory, MenuItem
from app.schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
    CategoryWithItemsResponse,
    MenuItemCreate,
    MenuItemResponse,
    MenuItemUpdate,
)

router = APIRouter(prefix="/admin", tags=["admin-menu"])


# ---------- Categories ----------


@router.get("/categories", response_model=list[CategoryWithItemsResponse])
def list_categories(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    """Admin view of all categories and items, including unavailable items."""
    return (
        db.query(MenuCategory)
        .options(selectinload(MenuCategory.items))
        .order_by(MenuCategory.display_order)
        .all()
    )


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    category = MenuCategory(**category_in.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def _get_category_or_404(category_id: int, db: Session) -> MenuCategory:
    category = db.query(MenuCategory).filter(MenuCategory.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@router.patch("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    category = _get_category_or_404(category_id, db)
    for key, value in category_update.model_dump(exclude_unset=True).items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    category = _get_category_or_404(category_id, db)
    # cascade="all, delete-orphan" on MenuCategory.items means this also
    # deletes every item in the category - the frontend should confirm this
    # with the admin before calling delete.
    db.delete(category)
    db.commit()


# ---------- Menu items ----------


def _get_item_or_404(item_id: int, db: Session) -> MenuItem:
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    return item


@router.post("/menu-items", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(
    item_in: MenuItemCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    _get_category_or_404(item_in.category_id, db)  # validate FK up front for a clean 404/422
    item = MenuItem(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/menu-items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,
    item_update: MenuItemUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    item = _get_item_or_404(item_id, db)

    update_data = item_update.model_dump(exclude_unset=True)
    if "category_id" in update_data:
        _get_category_or_404(update_data["category_id"], db)

    for key, value in update_data.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/menu-items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    item = _get_item_or_404(item_id, db)
    db.delete(item)
    db.commit()
