from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes.pose_routes import router
from database import init_db
from pydantic import BaseModel
from datetime import datetime, timedelta
from collections import Counter
import database
import warnings

# Suppress the MediaPipe / Protobuf deprecation warnings
warnings.filterwarnings("ignore", category=UserWarning, module="google.protobuf.symbol_database")

app = FastAPI(title="Yoga Pose Perfect API", version="1.0.0")

# Initialize database on startup
init_db()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the pose analysis routes
app.include_router(router, prefix="/api")

# Basic routes
@app.get("/")
def root():
    return {"message": "Welcome to the Yoga Pose Perfect Backend API"}

@app.get("/health")
def health():
    return {"status": "ok"}

# --- Auth models ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/api/register")
def register(data: UserRegister):
    user = database.register_user(data.name, data.email, data.password)
    if user:
        return {"status": "success", "user_id": user["id"], "name": user["name"]}
    raise HTTPException(status_code=400, detail="Email already registered")

@app.post("/api/login")
def login(data: UserLogin):
    user = database.login_user(data.email, data.password)
    if user:
        return {"status": "success", "user_id": user["id"], "name": user["name"]}
    raise HTTPException(status_code=401, detail="Invalid email or password")

# --- Session model ---
class SessionData(BaseModel):
    user_id: int = 1
    pose_name: str
    best_score: int
    average_score: int
    duration_seconds: int

@app.post("/api/sessions/save")
def save_session(data: SessionData):
    database.save_session(
        user_id=data.user_id,
        pose_name=data.pose_name,
        best_score=data.best_score,
        average_score=data.average_score,
        duration_seconds=data.duration_seconds
    )
    return {"status": "saved"}

@app.get("/api/sessions")
def get_sessions(user_id: int = 1):
    sessions = database.get_all_sessions(user_id)
    return {"sessions": sessions}

@app.get("/api/sessions/weekly")
def get_weekly(user_id: int = 1):
    weekly = database.get_weekly_scores(user_id)
    return {"weekly": weekly}

@app.get("/api/stats/streak")
def get_streak(user_id: int = 1):
    streak, dates = database.get_streak(user_id)
    return {"streak": streak, "session_dates": dates}

@app.get("/api/stats/achievements")
def get_achievements(user_id: int = 1):
    return database.get_achievements(user_id)
# --- WebSocket endpoint ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Frontend connected via WebSocket")
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({
                "status": "connected",
                "message": "Backend is ready"
            })
    except Exception as e:
        print(f"WebSocket disconnected: {e}")