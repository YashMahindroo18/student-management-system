from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine
from app.db.models import Base

from app.routers import auth, admin, student

app = FastAPI()

# ✅ CORS CONFIG (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://student-management-system-theta-henna.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables (keep this, but DO NOT use drop_all)
Base.metadata.create_all(bind=engine)

# ✅ Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(student.router, prefix="/student", tags=["Student"])


# ✅ Health check (optional but useful)
@app.get("/")
def root():
    return {"message": "Backend running"}