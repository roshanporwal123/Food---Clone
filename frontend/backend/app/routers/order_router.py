import razorpay
import os
import hmac
import hashlib

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Order, OrderItem, MenuItem, User
from app.schemas.schemas import OrderCreate, OrderOut
from app.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])
razorpay_client= razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))


@router.post("/", response_model=OrderOut)
def place_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    total_amount = 0.0
    order_items = []

    for item in order_data.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        if not menu_item or not menu_item.is_available:
            raise HTTPException(status_code=400, detail=f"Menu item {item.menu_item_id} unavailable")
        total_amount += menu_item.price * item.quantity
        order_items.append(OrderItem(
            menu_item_id=menu_item.id,
            quantity=item.quantity,
            price_at_order=menu_item.price,
        ))

    new_order = Order(
        customer_id=current_user.id,
        restaurant_id=order_data.restaurant_id,
        total_amount=total_amount,
        delivery_address=order_data.delivery_address,
        items=order_items,
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/", response_model=List[OrderOut])
def my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Order).filter(Order.customer_id == current_user.id).order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.customer_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{order_id}/create-payment")
def create_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.id == order_id, Order.customer_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    razorpay_order = razorpay_client.order.create({
        "amount": int(order.total_amount * 100),  # paise mein
        "currency": "INR",
        "receipt": f"order_{order.id}",
        "payment_capture": 1,
    })

    order.razorpay_order_id = razorpay_order["id"]
    db.commit()

    return {
        "razorpay_order_id": razorpay_order["id"],
        "amount": razorpay_order["amount"],
        "currency": razorpay_order["currency"],
        "key_id": os.getenv("RAZORPAY_KEY_ID"),
    }


@router.post("/{order_id}/verify-payment")
def verify_payment(
    order_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.id == order_id, Order.customer_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    razorpay_order_id = payload.get("razorpay_order_id")
    razorpay_payment_id = payload.get("razorpay_payment_id")
    razorpay_signature = payload.get("razorpay_signature")

    generated_signature = hmac.new(
        os.getenv("RAZORPAY_KEY_SECRET").encode(),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()

    if generated_signature != razorpay_signature:
        order.payment_status = "failed"
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")

    order.payment_status = "paid"
    db.commit()
    return {"detail": "Payment verified successfully", "payment_status": "paid"}