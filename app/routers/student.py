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

from app.utils.grade import get_grade, get_grade_point

@router.get("/marks/{semester}")
def get_marks(
    semester: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("student"))
):
    marks = db.query(Mark).filter(
        Mark.student_email == user.email,   # ✅ FIXED
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
@router.get("/cgpa")
def get_cgpa(
    db: Session = Depends(get_db),
    user=Depends(require_role("student"))
):
    marks = db.query(Mark).filter(
        Mark.student_email == user.email
    ).all()

    if not marks:
        return {"cgpa": 0}

    total_gp = 0
    count = 0

    for m in marks:
        gp = get_grade_point(m.score if m.score else 0)
        total_gp += gp
        count += 1

    cgpa = round(total_gp / count, 2)

    return {"cgpa": cgpa}
from fastapi import Query, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Mark
from app.utils.grade import get_grade, get_grade_point
from app.core.security import decode_access_token  # ✅ IMPORTANT

from fastapi import Query, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Mark
from app.utils.grade import get_grade, get_grade_point
from app.core.security import decode_access_token

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

import io


@router.get("/marksheet/pdf/{semester}")
def download_marksheet(
    semester: int,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    # 🔐 Decode token
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")

    # 🔍 Fetch marks
    marks = db.query(Mark).filter(
        Mark.student_email == user_email,
        Mark.semester == semester
    ).all()

    if not marks:
        raise HTTPException(status_code=404, detail="No marks found")

    # 📄 Create PDF buffer
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # 🔹 Title
    elements.append(Paragraph("IILM University", styles["Title"]))
    elements.append(Paragraph(f"Semester {semester} Marksheet", styles["Heading2"]))
    elements.append(Paragraph(f"Student: {user_email}", styles["Normal"]))

    # 🔹 Table data
    data = [["Subject", "Marks", "Grade", "GP"]]

    total_gp = 0

    for m in marks:
        score = m.score
        grade = get_grade(score)
        gp = get_grade_point(score)

        total_gp += gp

        data.append([m.subject, score, grade, gp])

    sgpa = round(total_gp / len(marks), 2)

    data.append(["", "", "SGPA", sgpa])

    # 🔹 Table styling
    table = Table(data)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.grey),
        ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("GRID", (0,0), (-1,-1), 1, colors.black),
    ]))

    elements.append(table)

    # 🔹 Build PDF
    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=marksheet_sem_{semester}.pdf"
        }
    )