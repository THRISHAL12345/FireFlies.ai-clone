from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app.models import domain # Import to ensure models are registered
from app.routers import meetings, transcripts, summaries, action_items, chat

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fireflies Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(summaries.router)
app.include_router(action_items.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Fireflies Clone API"}
