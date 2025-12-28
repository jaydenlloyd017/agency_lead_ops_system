from fastapi import FastAPI

app = FastAPI()

@app.get("/leads")
async def get_leads():
    return {"leads": []}