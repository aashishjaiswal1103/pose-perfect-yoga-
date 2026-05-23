import os
import bcrypt
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta
from collections import Counter

# Load .env file
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def init_db():
    """Tables already created in Supabase dashboard — just verify connection"""
    try:
        supabase.table("session").select("id").limit(1).execute()
        print("Supabase connected successfully")
    except Exception as e:
        print(f"Supabase connection error: {e}")

def register_user(name: str, email: str, password: str):
    existing = supabase.table("users").select("id").eq("email", email).execute()
    if existing.data:
        return None  # Email taken

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    data = {
        "name": name,
        "email": email,
        "password_hash": password_hash
    }
    response = supabase.table("users").insert(data).execute()
    return response.data[0] if response.data else None

def login_user(email: str, password: str):
    response = supabase.table("users").select("*").eq("email", email).execute()
    if not response.data:
        return None
    
    user = response.data[0]
    if bcrypt.checkpw(password.encode('utf-8'), user["password_hash"].encode('utf-8')):
        return {"id": user["id"], "name": user["name"]}
    return None

def save_session(user_id: int, pose_name: str, best_score: int,
                 average_score: int, duration_seconds: int):
    """Save one session to Supabase"""
    data = {
        "user_id": user_id,
        "pose_name": pose_name,
        "best_score": best_score,
        "average_score": average_score,
        "duration_seconds": duration_seconds,
        "created_at": datetime.now().isoformat()
    }
    supabase.table("session").insert(data).execute()

def get_all_sessions(user_id: int = 1):
    """Get all sessions for a user newest first"""
    response = supabase.table("session")\
        .select("*")\
        .eq("user_id", user_id)\
        .order("created_at", desc=True)\
        .execute()
    return response.data

def get_weekly_scores(user_id: int = 1):
    """Get sessions from last 7 days for chart"""
    week_ago = (datetime.now() - timedelta(days=7)).isoformat()
    response = supabase.table("session")\
        .select("average_score, created_at")\
        .eq("user_id", user_id)\
        .gte("created_at", week_ago)\
        .execute()

    # Group by day manually
    day_scores = {}
    for session in response.data:
        day = session["created_at"][:10]
        if day not in day_scores:
            day_scores[day] = []
        day_scores[day].append(session["average_score"])

    return [
        {"day": day, "avg_score": round(sum(scores) / len(scores))}
        for day, scores in sorted(day_scores.items())
    ]

def get_streak(user_id: int = 1):
    """Count consecutive days user practiced"""
    response = supabase.table("session")\
        .select("created_at")\
        .eq("user_id", user_id)\
        .execute()

    if not response.data:
        return 0, []

    dates = sorted(set([s["created_at"][:10] for s in response.data]), reverse=True)
    streak = 0
    today = datetime.now().date()

    for i, date_str in enumerate(dates):
        day = datetime.strptime(date_str, "%Y-%m-%d").date()
        if day == today - timedelta(days=i):
            streak += 1
        else:
            break

    return streak, dates

def get_achievements(user_id: int = 1):
    """Compute achievements from all sessions"""
    response = supabase.table("session")\
        .select("*")\
        .eq("user_id", user_id)\
        .execute()

    sessions = response.data
    if not sessions:
        return {
            "best_accuracy": 0,
            "longest_session": 0,
            "total_sessions": 0,
            "favorite_pose": "None"
        }

    best_accuracy = max(s["best_score"] for s in sessions)
    longest_session = max(s["duration_seconds"] for s in sessions)
    total_sessions = len(sessions)
    pose_counts = Counter(s["pose_name"] for s in sessions)
    favorite_pose = pose_counts.most_common(1)[0][0]

    return {
        "best_accuracy": best_accuracy,
        "longest_session": longest_session,
        "total_sessions": total_sessions,
        "favorite_pose": favorite_pose
    }