from datetime import datetime, timedelta, timezone
from jose import jwt


SECRET_KEY = "55e4e9549904a7ac222690c23793855e906db6dc6fca802c5f5b8ad78deaa679"  # keep this secret
ALGORITHM = "HS256"  # HMAC-SHA256
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    """
    Generates a JWT token with expiration.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

