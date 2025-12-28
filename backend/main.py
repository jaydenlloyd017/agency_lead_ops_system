from fastapi import FastAPI, Depends
from sqlalchemy. orm import Session
from database import get_db
from models import Lead

app = FastAPI()

@app.get("/leads")
async def get_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).all()  # Get all rows from leads table
    return {"leads": leads}
   