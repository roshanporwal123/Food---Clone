from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.models import Restaurant, User, UserRole
from app.schemas.schemas import RestaurantCreate, RestaurantOut
from app.auth import get_current_user

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("/", response_model=List[RestaurantOut])
def list_restaurants(city: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Restaurant).filter(Restaurant.is_active == True)
    if city:
        query = query.filter(Restaurant.city.ilike(f"%{city}%"))
    if search:
        query = query.filter(Restaurant.name.ilike(f"%{search}%"))
    return query.all()


@router.get("/{restaurant_id}", response_model=RestaurantOut)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant


@router.post("/", response_model=RestaurantOut)
def create_restaurant(
    restaurant: RestaurantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.restaurant_owner:
        raise HTTPException(status_code=403, detail="Only restaurant owners can create restaurants")

    new_restaurant = Restaurant(**restaurant.dict(), owner_id=current_user.id)
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    return new_restaurant

@router.put("/{restaurant_id}", response_model=RestaurantOut)
def update_restaurant(
    restaurant_id: int,
    restaurant: RestaurantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    if db_restaurant.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this restaurant")

    for key, value in restaurant.dict(exclude_unset=True).items():
        setattr(db_restaurant, key, value)

    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant
