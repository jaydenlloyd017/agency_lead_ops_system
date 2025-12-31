
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Lead, LeadStatus, User, LeadStatusHistory
from backend.schemas import LeadCreate, LeadStatusUpdate, UserCreate, UserResponse

from passlib.context import CryptContext

router = APIRouter(prefix="/auth")

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

@router.get("/auth")
async def test():
    return {'user': 'authenticated'}


@router.post("/register", response_model=UserResponse)
async def register_user(user_in : UserCreate, db: Session = Depends(get_db)):

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
