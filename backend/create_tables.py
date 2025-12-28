from database import Base, engine
from models import Lead, User, LeadStatusHistory

# Create all tables
Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully!")