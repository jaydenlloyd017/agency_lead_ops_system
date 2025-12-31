
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Lead, LeadStatus, User, LeadStatusHistory
from backend.schemas import LeadCreate, LeadStatusUpdate, UserCreate, UserResponse, UserLogin
from backend.jwt_utils import create_access_token
from passlib.context import CryptContext

router = APIRouter(prefix="/auth")

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


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

@router.post("/login")
async def authenticate_user(
        user_login: UserLogin, 
        db: Session = Depends(get_db)
        ):

    user = db.query(User).filter(User.email == user_login.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not bcrypt_context.verify(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token_data = {"user_id": user.id, "email": user.email}
    access_token = create_access_token(token_data)

    return {"access_token": access_token, "token_type": "bearer"}