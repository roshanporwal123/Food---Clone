from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from app.models.models import UserRole, OrderStatus


# ---------- User ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: UserRole = UserRole.customer


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Restaurant ----------
class RestaurantCreate(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: str
    cuisine_type: Optional[str] = None
    image_url: Optional[str] = None


class RestaurantOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    address: Optional[str]
    city: str
    cuisine_type: Optional[str]
    rating: float
    image_url: Optional[str]

    class Config:
        from_attributes = True


# ---------- Menu Item ----------
class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_veg: bool = True
    category: Optional[str] = None


class MenuItemOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    image_url: Optional[str]
    is_veg: bool
    is_available: bool
    category: Optional[str]

    class Config:
        from_attributes = True


# ---------- Order ----------
class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = 1


class OrderCreate(BaseModel):
    restaurant_id: int
    delivery_address: str
    items: List[OrderItemCreate]


class OrderItemOut(BaseModel):
    id: int
    menu_item_id: int
    quantity: int
    price_at_order: float

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    status: OrderStatus
    total_amount: float
    delivery_address: str
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True
