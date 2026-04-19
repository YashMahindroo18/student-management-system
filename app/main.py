from fastapi import FastAPI
from app.routers import auth, admin, student
from app.db.database import Base, engine
from app.db import models  # IMPORTANT: ensures models are loaded
from app.db.database import engine
from app.db.models import Base




Base.metadata.create_all(bind=engine)
app = FastAPI()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(student.router, prefix="/student", tags=["Student"])