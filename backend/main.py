from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from backend.routers import auth, leads
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(auth.router)

app.include_router(leads.router)
