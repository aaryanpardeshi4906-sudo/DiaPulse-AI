import os
from datetime import datetime
from typing import Any, Literal

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel, Field, field_validator

load_dotenv()

app = FastAPI(
    title="DiaPulse AI API",
    description="AI-powered personalized health companion and analytics platform",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_RECORDS = [
    {
        "recorded_at": "2026-10-05T08:15:00",
        "glucose": 102,
        "meal": "Oatmeal and berries",
        "medication": "Metformin 500mg",
        "activity_minutes": 31,
        "symptoms": "Mild afternoon fatigue",
        "sleep_hours": 7.4,
        "weight": 72.4,
    },
    {
        "recorded_at": "2026-10-04T07:50:00",
        "glucose": 110,
        "meal": "Greek yogurt and fruit",
        "medication": "Metformin 500mg",
        "activity_minutes": 42,
        "symptoms": "No major symptoms",
        "sleep_hours": 7.9,
        "weight": 72.5,
    },
    {
        "recorded_at": "2026-10-03T08:10:00",
        "glucose": 98,
        "meal": "Vegetable omelet",
        "medication": "Vitamin D",
        "activity_minutes": 25,
        "symptoms": "Restless evening",
        "sleep_hours": 6.9,
        "weight": 72.7,
    },
]


def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


class HealthRecordPayload(BaseModel):
    glucose: float = Field(..., gt=0, le=500)
    meal: str = Field(..., min_length=2, max_length=200)
    medication: str = Field(..., min_length=1, max_length=200)
    activity_minutes: int = Field(..., ge=0, le=600)
    symptoms: str = Field(default="", max_length=500)
    sleep_hours: float = Field(..., gt=0, le=24)
    weight: float = Field(..., gt=0, le=300)
    recorded_at: str | None = None

    @field_validator("meal", "medication", "symptoms")
    @classmethod
    def strip_text(cls, value: str) -> str:
        if value is None:
            return ""
        return value.strip()


class AssistantRequest(BaseModel):
    prompt: str = Field(..., min_length=2, max_length=1200)
    healthData: list[dict[str, Any]] | None = None


def build_analytics(records: list[dict[str, Any]]) -> dict[str, Any]:
    if not records:
        records = DEFAULT_RECORDS

    df = pd.DataFrame(records)
    df["recorded_at"] = pd.to_datetime(df["recorded_at"], errors="coerce")
    df = df.dropna(subset=["recorded_at"]).sort_values("recorded_at")

    if df.empty:
        return {
            "summary": {"score": 82, "status": "Stable"},
            "patterns": [
                {"title": "Sample pattern", "analysis": "No personal records were available, so a demo summary is shown."}
            ],
        }

    glucose = df["glucose"].astype(float)
    sleep = df["sleep_hours"].astype(float)
    activity = df["activity_minutes"].astype(float)
    weight = df["weight"].astype(float)

    sleep_score = min(100, max(0, (sleep.mean() / 8.0) * 100))
    activity_score = min(100, max(0, (activity.mean() / 45.0) * 100))
    glucose_score = min(100, max(0, 100 - abs(glucose.mean() - 100) * 1.7))
    weight_score = min(100, max(0, 100 - abs(weight.mean() - 72.5) * 2.1))

    summary_score = int(round((sleep_score + activity_score + glucose_score + weight_score) / 4))
    if summary_score >= 80:
        status = "Strong"
    elif summary_score >= 60:
        status = "Steady"
    else:
        status = "Needs attention"

    trend = "Your recent patterns suggest healthy daily rhythms with minor variations around activity and sleep."

    return {
        "summary": {
            "score": summary_score,
            "status": status,
            "trend": trend,
            "average_glucose": round(float(glucose.mean()), 1),
            "average_sleep": round(float(sleep.mean()), 1),
            "average_activity": round(float(activity.mean()), 1),
            "average_weight": round(float(weight.mean()), 1),
        },
        "patterns": [
            {
                "title": "Activity and glucose",
                "analysis": "Lower activity days often align with slightly higher glucose readings for this profile.",
                "risk_level": "Moderate",
            },
            {
                "title": "Sleep consistency",
                "analysis": "Sleep duration remained supportive of daily routine and energy balance.",
                "risk_level": "Low",
            },
        ],
    }


def get_assistant_response(prompt: str, health_data: list[dict[str, Any]] | None = None) -> str:
    normalized = (prompt or '').lower()
    records = health_data or DEFAULT_RECORDS

    # Deterministic safety-first logic before any model interaction.
    if "glucose" in normalized and "week" in normalized:
        values = [float(item.get("glucose", 100)) for item in records[:5]]
        avg = np.mean(values) if values else 100
        return (
            "Across the most recent readings, your average glucose is approximately "
            f"{avg:.1f} mg/dL. The trend remains mostly stable, and maintaining a consistent meal pattern and activity routine can help support steady readings."
        )

    if "sleep" in normalized:
        values = [float(item.get("sleep_hours", 7.5)) for item in records[:5]]
        avg = np.mean(values) if values else 7.5
        return (
            f"Your recent sleep average is about {avg:.1f} hours. A consistent bedtime, limiting screens before sleep, and keeping a steady waking time may support better rest quality."
        )

    if "activity" in normalized or "suggestion" in normalized:
        return (
            "A moderate walk after a meal or a 15-20 minute movement break can be a supportive daily habit. Keeping it simple and consistent is often easier to maintain."
        )

    if "pattern" in normalized or "recent" in normalized:
        return (
            "Your recent routine suggests stronger daily stability when sleep and movement are consistent. The most notable signal is a relationship between lower movement and slightly higher glucose readings on some days."
        )

    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        try:
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a careful health assistant. Never diagnose, prescribe medication, or make emergency claims. Speak in supportive, non-diagnostic language. Use only safe, general, educational guidance.",
                    },
                    {
                        "role": "user",
                        "content": f"User question: {prompt}\nRecent health context: {records[:5]}",
                    },
                ],
                temperature=0.4,
                max_tokens=250,
            )
            return completion.choices[0].message.content.strip() or "I can help with general wellness guidance. Please ask about sleep, movement, glucose trends, or routines."
        except Exception:
            pass

    return (
        "I can help with general wellness guidance. Focus on routine consistency, sleep quality, movement, and a balanced meal pattern. If you notice a significant or persistent change, it may be worth discussing with a healthcare professional."
    )


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "DiaPulse AI API"}


@app.get("/api/health-records")
def get_health_records(user_id: str | None = None):
    if user_id is None:
        return {"records": DEFAULT_RECORDS, "count": len(DEFAULT_RECORDS), "demo": True}

    return {"records": DEFAULT_RECORDS, "count": len(DEFAULT_RECORDS), "demo": True}


@app.post("/api/health-records")
def create_health_record(payload: HealthRecordPayload):
    record = payload.model_dump()
    record["recorded_at"] = record.get("recorded_at") or datetime.utcnow().isoformat()
    return {"record": record, "success": True}


@app.get("/api/analytics")
def get_analytics():
    return build_analytics(DEFAULT_RECORDS)


@app.get("/api/insights")
def get_insights():
    return {
        "insights": [
            {
                "insight_type": "Potential pattern detected",
                "title": "Glucose shifts with activity",
                "risk_level": "Moderate",
                "explanation": "Your glucose readings appear slightly higher on lower-activity days.",
                "recommendation": "A short walk after meals may help support steadier daily patterns.",
                "created_at": datetime.utcnow().isoformat(),
            }
        ]
    }


@app.post("/api/assistant")
def assistant_chat(payload: AssistantRequest):
    if not payload.prompt or not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required.")

    answer = get_assistant_response(payload.prompt, payload.healthData)
    return {"answer": answer}

