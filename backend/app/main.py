from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth_router, restaurant_router, menu_router, order_router

# Dev ke liye: tables auto-create. Production me Alembic migrations use karo.
# Base.metadata.create_all(bind=engine)

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
