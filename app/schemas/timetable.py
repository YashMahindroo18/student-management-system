from pydantic import BaseModel

class TimetableCreate(BaseModel):
    year: int
    section: str
    day: str
    slot: int
    subject: str

class TimetableResponse(BaseModel):
    year: int
    section: str
    day: str
    slot: int
    subject: str

    class Config:
        from_attributes = True