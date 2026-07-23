from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import RestaurantInfo
from app.schemas import RestaurantInfoResponse

router = APIRouter(tags=["restaurant-info"])


@router.get("/restaurant-info", response_model=RestaurantInfoResponse)
def get_restaurant_info(db: Session = Depends(get_db)):
    info = db.query(RestaurantInfo).filter(RestaurantInfo.id == 1).first()
    if info is None:
        # First run before any admin edits: return sensible empty defaults
        # rather than a 404, so the public site can render without special-casing this.
        info = RestaurantInfo(id=1, hours={})
        db.add(info)
        db.commit()
        db.refresh(info)
    return info
