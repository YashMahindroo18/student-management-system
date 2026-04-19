from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.dependencies import require_role
from app.db.database import get_db
from app.db.models import Student
from app.db.models import Mark
from app.db.models import Timetable
from app.schemas.timetable import TimetableResponse
from app.utils.grade import get_grade, get_grade_point
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

@router.get("/marks/{semester}")
def get_marks(
    semester: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("student"))
):
    marks = db.query(Mark).filter(
        Mark.student_email == user["sub"],
        Mark.semester == semester
    ).all()

    result = []

    for m in marks:
        score = m.score if m.score is not None else 0

        result.append({
            "subject": m.subject,
            "score": score,
            "grade": get_grade(score),
            "gp": get_grade_point(score)
        })

    return result
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