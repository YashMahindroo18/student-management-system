from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Student
from app.schemas.student import StudentCreate, StudentResponse
from app.utils.dependencies import require_role
from app.db.models import Mark
from app.schemas.mark import MarkCreate, MarkResponse

router = APIRouter()


@router.post("/students", response_model=StudentResponse)
def create_student_record(
    data: StudentCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    existing_email = db.query(Student).filter(Student.email == data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Student already exists")

    existing_roll = db.query(Student).filter(Student.roll_number == data.roll_number).first()
    if existing_roll:
        raise HTTPException(status_code=400, detail="Roll number already exists")

    student = Student(**data.dict())

    db.add(student)
    db.commit()
    db.refresh(student)

    return student


@router.get("/students", response_model=list[StudentResponse])
def get_all_students(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    return db.query(Student).all()
@router.post("/marks", response_model=MarkResponse)
def add_marks(
    data: MarkCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    mark = Mark(**data.dict())

    db.add(mark)
    db.commit()
    db.refresh(mark)

    return mark