from pydantic import BaseModel, EmailStr

class StudentResponse(BaseModel):
    email: str
    roll_number: str
    department: str
    year: int

    class Config:
        from_attributes = True

class StudentCreate(BaseModel):
    email: EmailStr
    roll_number: str
    department: str
    year: int
class StudentUpdate(BaseModel):
    department: str
    year: int