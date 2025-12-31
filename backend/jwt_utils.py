from datetime import datetime, timedelta, timezone
from jose import jwt


SECRET_KEY = "your-super-secret-key"  # keep this secret
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

