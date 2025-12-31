from fastapi import FastAPI
from backend.routers import auth, leads

app = FastAPI()

app.include_router(auth.router)

app.include_router(leads.router)