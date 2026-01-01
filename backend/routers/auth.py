from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Lead, LeadStatus, User, LeadStatusHistory
from backend.schemas import LeadCreate, LeadStatusUpdate, UserCreate, UserResponse, UserLogin, TokenData
from backend.jwt_utils import create_access_token
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from backend.database import get_db

router = APIRouter()

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


SECRET_KEY = "key" 
ALGORITHM = "HS256"

@router.post("/register", response_model=UserResponse)
async def register_user(user_in: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=bcrypt_context.hash(user_in.password),
        role=user_in.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user




def authenticate_user(email: str, password: str, db):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False

    if not bcrypt_context.verify(password, user.hashed_password):
        return False

    return True
@router.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        return 'Failed Authentication'
    return 'Successfull Authentication'