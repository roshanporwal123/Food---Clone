# TastyTrail — Food Ordering Clone (Swiggy/Zomato style)

Backend: FastAPI + SQLAlchemy (SQLite for dev)
Frontend: Next.js (App Router) + Tailwind CSS

## Backend chalane ke liye

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API `http://localhost:8000` par chalega. Docs: `http://localhost:8000/docs`

## Frontend chalane ke liye

```bash
cd frontend
npm install
npm run dev
```

App `http://localhost:3000` par chalega.

## Test flow

1. `/docs` (Swagger UI) se `POST /auth/signup` — role `restaurant_owner` se ek user banao
2. Login karke token lo, phir `POST /restaurants/` se restaurant + menu items add karo
3. Ek naya `customer` role user banao, frontend se login karo
4. Home page pe restaurant browse karo, cart me add karo, order place karo

## Kya missing hai (next steps)

- Payment integration (Razorpay/Stripe)
- Real-time order tracking (WebSockets)
- Image upload (abhi sirf URL field hai)
- Restaurant owner / admin dashboard UI
- Alembic migrations (production ke liye)
- Delivery partner app/flow

## Structure

```
backend/
  app/
    models/       # SQLAlchemy models
    schemas/      # Pydantic request/response schemas
    routers/      # API endpoints (auth, restaurants, menu, orders)
    auth.py       # JWT + password hashing
    database.py   # DB connection
    main.py       # FastAPI app entrypoint
frontend/
  app/            # Next.js pages (App Router)
  components/     # Navbar etc.
  lib/            # API client, cart context
```
