from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth_router, restaurant_router, menu_router, order_router
from app.models import models
# Dev ke liye: tables auto-create. Production me Alembic migrations use karo.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Food Delivery Clone API")

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000" , "http://127.0.0.1:3000" , "https://food-clone-pied.vercel.app","https://food-clone-el2ovod2v-roshan-porwal-s-projects.vercel.app" ],  # Next.js dev server
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(restaurant_router.router)
app.include_router(menu_router.router)
app.include_router(order_router.router)


@app.get("/")
def root():
    return {"message": "Food Delivery Clone API is running"}

# for seeding the database with dummy data
from fastapi import HTTPException
from app.database import SessionLocal
# Apne models import karein
from app.models import User, Restaurant, MenuItem, UserRole

@app.get("/seed")
def seed_database():
    db = SessionLocal()
    try:
        # 1. Check karein agar restaurants pehle se majood hain
        if db.query(Restaurant).count() > 0:
            return {"message": "Database me pehle se restaurants exist karte hain!"}

        # 2. Pehle ek Dummy Owner User banayein (FK constraint ke liye)
        owner = db.query(User).filter(User.email == "owner@tastytrail.com").first()
        if not owner:
            owner = User(
                name="Restaurant Owner",
                email="owner@tastytrail.com",
                hashed_password="dummy_password_hash",  # Fast seed ke liye
                role=UserRole.restaurant_owner
            )
            db.add(owner)
            db.commit()
            db.refresh(owner)

        # 3. Dummy Restaurants add karein
        rest1 = Restaurant(
            name="Tasty Trail Hub",
            description="Best North Indian & Fast Food in town",
            address="123 Main Street, Central Market",
            city="Indore",
            cuisine_type="North Indian",
            rating=4.5,
            image_url="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
            is_active=True,
            owner_id=owner.id
        )

        rest2 = Restaurant(
            name="Pizza & Pasta Express",
            description="Authentic Italian Pizzas with Cheesy Crust",
            address="45 Baker Street",
            city="Indore",
            cuisine_type="Italian",
            rating=4.8,
            image_url="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
            is_active=True,
            owner_id=owner.id
        )

        db.add_all([rest1, rest2])
        db.commit()
        db.refresh(rest1)
        db.refresh(rest2)

        # 4. In Restaurants ke liye Menu Items add karein
        items = [
            MenuItem(
                name="Butter Chicken",
                description="Rich cream and tomato gravy chicken",
                price=320.0,
                is_veg=False,
                is_available=True,
                category="Main Course",
                image_url="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500",
                restaurant_id=rest1.id
            ),
            MenuItem(
                name="Paneer Tikka",
                description="Grilled paneer marinated in spices",
                price=240.0,
                is_veg=True,
                is_available=True,
                category="Starters",
                image_url="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500",
                restaurant_id=rest1.id
            ),
            MenuItem(
                name="Margherita Pizza",
                description="Classic cheese and tomato sauce pizza",
                price=299.0,
                is_veg=True,
                is_available=True,
                category="Pizzas",
                image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
                restaurant_id=rest2.id
            )
        ]

        db.add_all(items)
        db.commit()

        return {"message": "Success! 2 Restaurants and Menu Items created successfully."}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()