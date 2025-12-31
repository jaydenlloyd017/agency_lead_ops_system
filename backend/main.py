from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from backend.routers import auth, leads

app = FastAPI()

app.include_router(auth.router)

app.include_router(leads.router)