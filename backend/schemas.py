from typing import Optional, Annotated
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from backend.models import LeadStatus

class LeadCreate(BaseModel):
    full_name: str
    email:  EmailStr
    phone: Optional[str] = Field(None, pattern=r"^07\d{9}$", example="07123456789")  
    source:  Optional[str] = Field(None, description="Source of the lead (e.g., 'website', 'referral')")

class LeadStatusUpdate(BaseModel):
    new_status: LeadStatus

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: Annotated[str, Field(min_length=6)]
    role: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: Annotated[str, Field(pattern="^(admin|rep)$")]

    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenData(BaseModel):
    user_id: int
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LeadResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str]
    source: Optional[str]
    status: LeadStatus

    model_config = {"from_attributes": True}