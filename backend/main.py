from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Lead, LeadStatus, User, LeadStatusHistory
from schemas import LeadCreate, LeadStatusUpdate

app = FastAPI()

# --- Read all leads --- 
@app.get("/leads")
async def get_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).all()  # Get all rows from leads table
    return leads

# --- Create a lead + automatic assignment of rep 
@app.post("/api/leads")
async def create_lead(lead_in: LeadCreate, db: Session = Depends(get_db)):

    existing_lead = db.query(Lead).filter(Lead.email == lead_in.email).first()
    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead with this email already exists"
        )
    
    new_lead = Lead(
        full_name=lead_in.full_name,
        email=lead_in.email,
        phone=lead_in.phone,
        source=lead_in.source,
        status=LeadStatus.NEW  # force default
    )

    # --- Round Robin for assigning reps --- 
 
    # Filtering reps that are active 
    reps = db.query(User).filter(User.role == 'rep', User.is_active == True).all()
    if not reps:
        raise HTTPException(status_code=400, detail="No active reps to assign lead")
    
    # Finding the rep with latest lead assignment by ID
    last_assigned_rep = db.query(Lead.assigned_to).filter(Lead.assigned_to != None).order_by(Lead.created_at.desc()).first()
    last_assigned_rep_id = last_assigned_rep[0] if last_assigned_rep else None

    # Finds last_assigned_rep_id and matches to the rep.id in the user table
    if last_assigned_rep_id:
        last_index = next((i for i, rep in enumerate(reps) if rep.id == last_assigned_rep_id), -1)
    else:
        last_index = -1  # start from first rep if no lead assigned yet
    
    # Takes last assigned rep and passes to next in line
    next_index = (last_index + 1) % len(reps)
    next_rep = reps[next_index]

    new_lead.assigned_to = next_rep.id

    # Save lead
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)

    return new_lead

# --- Change the status of the lead ---

@app.patch("/api/leads/{lead_id}/status")
async def update_lead_status(lead_id: int, status_update: LeadStatusUpdate, db: Session = Depends(get_db)):

    # Get lead from table 
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    new_status = status_update.new_status

    # Define allowed status transitions
    allowed_transitions = {
        LeadStatus.NEW: [LeadStatus.CONTACTED],
        LeadStatus.CONTACTED: [LeadStatus.QUALIFIED, LeadStatus.CLOSED_LOST],
        LeadStatus.QUALIFIED: [LeadStatus.BOOKED, LeadStatus.CLOSED_LOST],
        LeadStatus.BOOKED: [LeadStatus.CLOSED_WON, LeadStatus.CLOSED_LOST],
    }
    
    current_status = lead.status
    
    # --- Validation for transition ---
    
    # Check if the lead is in terminal state (won or closed)
    if current_status not in allowed_transitions:
        raise HTTPException(
            status_code=400,
            detail=f"Lead is already in terminal state: {current_status}"
        )
    
    # Check if the lead is correct transition - no skipping
    if new_status not in allowed_transitions[current_status]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot move from {current_status} to {new_status}"
        )
    
    lead.status = new_status
    
    # Log the history table  
    history_entry = LeadStatusHistory(
        lead_id = lead.id,
        from_status = current_status,
        to_status=new_status,
        changed_by=None
    )

    db.add(history_entry)
    db.commit()
    db.refresh(lead)

    # New updated lead 
    return {
        "lead": {
            "id": lead.id,
            "full_name": lead.full_name,
            "email": lead.email,
            "status": lead.status,
            "assigned_to": lead.assigned_to
        },
        "message": f"Lead status updated from {current_status} to {new_status}"
    }



# - Fetch the full status timeline for a lead
@app.get("/api/leads/{id}/history")
async def get_lead_history(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    history_entries = db.query(LeadStatusHistory).filter(
        LeadStatusHistory.lead_id == lead_id
    ).order_by(LeadStatusHistory.changed_at.asc()).all()

    return [
        {
            "from_status": entry.from_status,
            "to_status": entry.to_status,
            "changed_by": entry.changed_by,
            "changed_at": entry.changed_at
        } for entry in history_entries
    ]