from fastapi import APIRouter

router = APIRouter()

@router.get("/auth")
async def test():
    return {'user': 'authenticated'}
