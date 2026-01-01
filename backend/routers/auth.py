from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Lead, LeadStatus, User, LeadStatusHistory
from backend.schemas import LeadCreate, LeadStatusUpdate, UserCreate, UserResponse, UserLogin, TokenData, Token
from backend.jwt_utils import create_access_token
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from backend.database import get_db

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

SECRET_KEY = "55e4e9549904a7ac222690c23793855e906db6dc6fca802c5f5b8ad78deaa679" 
ALGORITHM = "HS256"

@router.post("/", response_model=UserResponse)
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

    return user

def create_access_token(email: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)], db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        user_id: int = payload.get('id')
        if email is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORISED,
                                 detail='Could not validate user.')
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORISED,
                             detail='Could not validate user.')
    
    # Query the database for the user
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user



@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORISED,
                                 detail='Could not validate user.')
    token = create_access_token(user.email, user.id, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}