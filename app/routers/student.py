from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.dependencies import require_role
from app.db.database import get_db
from app.db.models import Student
from app.db.models import Mark
from app.db.models import Timetable
from app.schemas.timetable import TimetableResponse
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


from app.schemas.mark import MarkResponse

@router.get("/marks", response_model=list[MarkResponse])
def get_marks(
    db: Session = Depends(get_db),
    user=Depends(require_role("student"))
):
    marks = db.query(Mark).filter(Mark.student_email == user.email).all()
    return marks
@router.get("/timetable", response_model=list[TimetableResponse])
def get_timetable(
    db: Session = Depends(get_db),
    user=Depends(require_role("student"))
):
    student = db.query(Student).filter(Student.email == user.email).first()

    timetable = db.query(Timetable).filter(
        Timetable.year == student.year,
        Timetable.section == "A"   # fixed for now
    ).all()

    return timetable