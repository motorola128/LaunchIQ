from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean, JSON
from datetime import datetime
from sqlalchemy.sql import func
from app.database import Base


# ─────────────────────────────
# USERS TABLE
# ─────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True,nullable=False)
    hashed_password = Column(String,nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ─────────────────────────────
# PREDICTIONS TABLE
# ─────────────────────────────
class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    # product info
    product_name = Column(String)

    broad_category = Column(String)

    atomic_category = Column(String)

    store = Column(String)

    # prediction result
    prediction_label = Column(String)

    success_percentage = Column(Float)

    probability_score = Column(Float)

    risk_level = Column(String)

    # benchmark metrics
    median_price = Column(Float)

    median_weight = Column(Float)

    median_feature_bullets = Column(Float)

    median_description_words = Column(Float)

    competition_index = Column(Float)

    # raw user inputs
    input_data = Column(JSON)

    # future SHAP explanations
    stratergy_reports = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# ─────────────────────────────
# SESSIONS TABLE
# ─────────────────────────────
class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    token = Column(String, unique=True, index=True)
    login_time = Column(DateTime, default=datetime.utcnow)
    expiry_time = Column(DateTime)

    is_active = Column(Boolean, default=True)


# ─────────────────────────────
# ADMIN LOGS TABLE
# ─────────────────────────────
class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"))

    action = Column(String)
    details = Column(JSON)

    timestamp = Column(DateTime, default=datetime.utcnow)