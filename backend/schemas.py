from typing import Optional, Annotated
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from backend.models import LeadStatus

class LeadCreate(BaseModel):
    full_name: str
    email:  EmailStr
    phone: Optional[str] = None
    source:  Optional[str] = None

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
    role: str

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