from sqlalchemy import Column, Integer, String, Boolean
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    roll_number = Column(String, unique=True)
    department = Column(String)
    year = Column(Integer)
    is_active = Column(Boolean, default=False)
class Mark(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True)
    student_email = Column(String)
    semester = Column(Integer)

    course_code = Column(String)
    course_name = Column(String)
    credit = Column(Integer)

    grade = Column(String)        # A, B+
    grade_point = Column(Integer) # 10, 9
    credit_point = Column(Integer)
class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(Integer, primary_key=True)
    year = Column(Integer)       # 2
    section = Column(String)     # A
    day = Column(String)         # Monday
    slot = Column(Integer)       # 1–7
    subject = Column(String)
