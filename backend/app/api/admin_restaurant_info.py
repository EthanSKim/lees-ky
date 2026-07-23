from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.auth import get_current_admin
from app.database import get_db
from app.models import AdminUser, RestaurantInfo
from app.schemas import RestaurantInfoResponse, RestaurantInfoUpdate

router = APIRouter(prefix="/admin", tags=["admin-restaurant-info"])


@router.patch("/restaurant-info", response_model=RestaurantInfoResponse)
def update_restaurant_info(
    info_update: RestaurantInfoUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    info = db.query(RestaurantInfo).filter(RestaurantInfo.id == 1).first()
    if info is None:
        info = RestaurantInfo(id=1, hours={})
        db.add(info)

    update_data = info_update.model_dump(exclude_unset=True)
    if "hours" in update_data and update_data["hours"] is not None:
        # Pydantic gives us DayHours objects; store plain dicts for the JSON column.
        update_data["hours"] = {
            day: [slot if isinstance(slot, dict) else slot.model_dump() for slot in slots]
            for day, slots in info_update.hours.items()
        }

    for key, value in update_data.items():
        setattr(info, key, value)

    db.commit()
    db.refresh(info)
    return info
