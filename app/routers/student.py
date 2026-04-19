from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.dependencies import require_role
from app.db.database import get_db
from app.db.models import Student
from app.db.models import Mark
router = APIRouter()


@router.get("/profile")
def student_profile(
    db: Session = Depends(get_db),
    user=Depends(require_role("student"))
):
    student = db.query(Student).filter(Student.email == user.email).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    return {
        "email": student.email,
        "roll_number": student.roll_number,
        "department": student.department,
        "year": student.year
    }


@router.get("/dashboard")
def student_dashboard(user=Depends(require_role("student"))):
    return {"message": f"Welcome {user.name}"}
@router.get("/marks", response_model=list[dict])
def get_marks(
    db: Session = Depends(get_db),
    user=Depends(require_role("student"))
):
    marks = db.query(Mark).filter(Mark.student_email == user.email).all()

    return marks