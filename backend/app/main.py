from fastapi import FastAPI

app = FastAPI(
    title="DiaPulse AI API",
    description="AI-powered personalized diabetes management platform",
    version="1.0.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DiaPulse AI API"
    }
