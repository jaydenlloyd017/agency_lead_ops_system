from pydantic import BaseModel, EmailStr
from typing import Optional

class LeadCreate(BaseModel):
    full_name: str
    email:  EmailStr
    phone: Optional[str] = None
    source:  Optional[str] = None

