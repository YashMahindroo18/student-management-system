from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Student, Mark
import random

db: Session = SessionLocal()

subjects = ["Maths", "DBMS", "OS", "CN", "AI", "ML"]

# 🔹 Create students
for i in range(1, 11):
    email = f"student{i}@example.com"

    existing = db.query(Student).filter(Student.email == email).first()
    if existing:
        continue

    student = Student(
        email=email,
        roll_number=f"CS{i:03}",
        department="CSE",
        year=2,
        is_active=True
    )

    db.add(student)
    db.commit()

    # 🔹 Add marks for 2 semesters
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

print("✅ Sample data inserted!")