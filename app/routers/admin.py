from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Student
from app.schemas.student import StudentCreate, StudentResponse
from app.utils.dependencies import require_role
from app.db.models import Mark
from app.schemas.mark import MarkCreate, MarkResponse
from app.db.models import Timetable
from app.schemas.timetable import TimetableCreate, TimetableResponse
from app.db.models import User
from app.core.security import hash_password

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
    # 🔍 Check student exists
    student = db.query(Student).filter(Student.email == data.student_email).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # ✅ Create mark with semester
    mark = Mark(
        student_email=data.student_email,
        subject=data.subject,
        score=data.score,
        semester=data.semester   # ✅ NEW
    )

    db.add(mark)
    db.commit()
    db.refresh(mark)

    return mark
@router.post("/timetable", response_model=TimetableResponse)
def add_timetable(
    data: TimetableCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    entry = Timetable(**data.dict())

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry
@router.delete("/timetable")
def clear_timetable(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    db.query(Timetable).delete()
    db.commit()

    return {"message": "Timetable cleared"}
@router.put("/students/activate/{email}")
def activate_student(
    email: str,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    student = db.query(Student).filter(Student.email == email).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.is_active = True

    db.commit()          # ✅ VERY IMPORTANT
    db.refresh(student)  # ✅ ALSO IMPORTANT

    return student
#temporary
@router.post("/seed")
def seed_data(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    import random

    subjects = ["Maths", "DBMS", "OS", "CN", "AI", "ML"]

    for i in range(1, 11):
        email = f"student{i}@example.com"

        student = Student(
            email=email,
            roll_number=f"CS{i:03}",
            department="CSE",
            year=2,
            is_active=True
        )
        db.add(student)

        user_obj = User(
            name=f"Student{i}",
            email=email,
            hashed_password=hash_password("123456"),
            role="student"
        )
        db.add(user_obj)
        db.commit()

        for sem in [1, 2]:
            for subject in subjects:
                mark = Mark(
                    student_email=email,
                    subject=subject,
                    score=random.randint(60, 95),
                    semester=sem
                )
                db.add(mark)

        db.commit()

    return {"message": "Seeded successfully"}