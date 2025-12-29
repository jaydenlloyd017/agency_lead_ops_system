from pydantic import BaseModel, EmailStr
from typing import Optional
from models import LeadStatus

class LeadCreate(BaseModel):
    full_name: str
    email:  EmailStr
    phone: Optional[str] = None
    source:  Optional[str] = None

class LeadStatusUpdate(BaseModel):
    new_status: LeadStatus