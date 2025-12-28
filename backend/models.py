from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.sql import func
from database import Base
import enum

class LeadStatus(str, enum.Enum):
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    QUALIFIED = "QUALIFIED"
    BOOKED = "BOOKED"
    CLOSED_WON = "CLOSED_WON"
    CLOSED_LOST = "CLOSED_LOST"



class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable = False)
    email = Column(String, nullable = False)
    phone = Column(String, nullable = True)
    source = Column(String, nullable = True)
    status = Column(Enum(LeadStatus), nullable=False, default=LeadStatus.NEW)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "admin" or "rep"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LeadStatusHistory(Base):
    __tablename__ = "lead_status_history"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    from_status = Column(Enum(LeadStatus), nullable=True)  # Null for first entry (creation)
    to_status = Column(Enum(LeadStatus), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null if system-generated
    changed_at = Column(DateTime(timezone=True), server_default=func.now())