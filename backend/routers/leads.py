from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Lead, LeadStatus, User, LeadStatusHistory
from backend.schemas import LeadCreate, LeadStatusUpdate
from .auth import get_current_user


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

# --- Read all leads --- 
@router.get("/leads")
async def get_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Add authentication dependency
):
    # Role-based access control
    if current_user.role == 'rep':
        # Reps can only view their assigned leads
        leads = db.query(Lead).filter(Lead.assigned_to == current_user.id).all()
    elif current_user.role == 'admin':
        # Admins can view all leads
        leads = db.query(Lead).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view leads."
        )

    # Error handling for empty results
    if not leads:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No leads found."
        )

    return leads

# --- Create a lead + automatic assignment of rep 
@router.post("/api/leads")
async def create_lead(user: user_dependency, lead_in: LeadCreate, db: Session = Depends(get_db)):

    if user is None:
        raise HTTPException(status_code=401, detail ='Authentication Failed')
    
    # Check if the user has the 'admin' role
    if user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to create leads."
        )

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
    last_index = -1  # default: start from first rep

    if last_assigned_rep_id:
        for i, rep in enumerate(reps):
            if rep.id == last_assigned_rep_id:
                last_index = i
                break

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

@router.patch("/api/leads/{lead_id}/status")
async def update_lead_status(
    lead_id: int,
    status_update: LeadStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Ensure authentication
):

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
    
    # Role-based access control
    if current_user.role == 'rep':
        if lead.assigned_to != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update this lead's status."
            )
        # Reps must follow transition rules
        if new_status not in allowed_transitions[current_status]:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot move from {current_status} to {new_status}"
            )

    elif current_user.role == 'admin':
        # Admins can bypass transition rules if needed (optional logic)
        pass

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

@router.get("/api/leads/{id}/history")
async def get_lead_history(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Ensure authentication
):
    # Query the lead to ensure it exists
    lead = db.query(Lead).filter(Lead.id == id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found."
        )

    # Role-based access control
    if current_user.role == 'rep' and lead.assigned_to != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this lead's history."
        )

    # Query the lead's status history
    history = db.query(LeadStatusHistory).filter(LeadStatusHistory.lead_id == id).all()

    # Return the history
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No history found for this lead."
        )

    return history