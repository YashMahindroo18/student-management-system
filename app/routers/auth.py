from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, Student
from app.schemas.user import UserLogin, ActivateUser
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter()


@router.get("/create-admin")
def create_admin(db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == "admin@example.com").first()
    if existing:
        return {"message": "Admin already exists"}

    admin = User(
        name="Admin",
        email="admin@example.com",
        hashed_password=hash_password("admin123"),
        role="admin"
    )
    db.add(admin)
    db.commit()
    return {"message": "Admin created"}


# ✅ FIXED ACTIVATION
@router.post("/activate")
def activate_account(data: ActivateUser, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == data.email).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if student.is_active:
        raise HTTPException(status_code=400, detail="Account already activated")

    existing_user = db.query(User).filter(User.email == student.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        name=student.roll_number,
        email=student.email,
        hashed_password=hash_password(data.password),
        role="student"
    )

    db.add(user)
    student.is_active = True
    db.commit()
    db.refresh(user)

    return {"message": "Account activated successfully"}


# ✅ FIXED LOGIN
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # 🔹 Only check activation for students
    if db_user.role == "student":
        student = db.query(Student).filter(Student.email == user.email).first()

        if not student or not student.is_active:
            raise HTTPException(status_code=403, detail="Account not activated")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {"access_token": token, "token_type": "bearer"}