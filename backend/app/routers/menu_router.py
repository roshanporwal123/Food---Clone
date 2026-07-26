from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import MenuItem, Restaurant, User, UserRole
from app.schemas.schemas import MenuItemCreate, MenuItemOut
from app.auth import get_current_user

router = APIRouter(prefix="/restaurants/{restaurant_id}/menu", tags=["menu"])


@router.get("/", response_model=List[MenuItemOut])
def list_menu_items(restaurant_id: int, db: Session = Depends(get_db)):
    return db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant_id,
        MenuItem.is_available == True,
    ).all()


@router.post("/", response_model=MenuItemOut)
def add_menu_item(
    restaurant_id: int,
    item: MenuItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    if restaurant.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your restaurant")

    new_item = MenuItem(**item.dict(), restaurant_id=restaurant_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{menu_item_id}")
def delete_menu_item(
    restaurant_id: int,
    menu_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(MenuItem).filter(
        MenuItem.id == menu_item_id,
        MenuItem.restaurant_id == restaurant_id,
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    db.delete(item)
    db.commit()
    return {"detail": "Menu item deleted successfully"}