from pydantic import BaseModel

class MarkCreate(BaseModel):
    student_email: str
    subject: str
    score: int

class MarkResponse(BaseModel):
    student_email: str
    subject: str
    score: int

    class Config:
        from_attributes = True