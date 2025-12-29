from sqlalchemy.orm import Session
from database import get_db
from models import User

# Example test reps
test_reps = [
    {"full_name": "Rep One", "email": "rep1@example.com", "hashed_password": "fakehash1", "role": "rep"},
    {"full_name": "Rep Two", "email": "rep2@example.com", "hashed_password": "fakehash2", "role": "rep"},
    {"full_name": "Rep Three", "email": "rep3@example.com", "hashed_password": "fakehash3", "role": "rep"},
]

def seed_reps():
    db: Session = next(get_db())
    for rep_data in test_reps:
        rep = User(**rep_data)
        db.add(rep)
    db.commit()
    print("✅ Test reps added successfully!")

if __name__ == "__main__":
    seed_reps()
