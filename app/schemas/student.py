from pydantic import BaseModel


class StudentCreate(BaseModel):
    email: str
    roll_number: str
    department: str
    year: int


class StudentResponse(BaseModel):
    email: str
    roll_number: str
    department: str
    year: int
    is_active: bool

    class Config:
        from_attributes = True



