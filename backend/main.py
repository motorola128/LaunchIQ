from fastapi import FastAPI
from app.database import engine, Base
import app.models
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth,predict

app = FastAPI(title="Pre-Launch Product Success Engine")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth")
# 👈 2. ADD THIS LINE to plug in your new ML route!
app.include_router(predict.router, prefix="/api", tags=["Machine Learning"])


@app.get("/")
def home():
    return {"message": "Backend running"}