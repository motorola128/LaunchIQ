from pydantic import BaseModel,field_validator
from datetime import datetime

# ───── USER INPUT ─────
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str
class PredictionRequest(BaseModel):
    product_name: str
    price: float
    weight: float
    feature_word_count: int
    features_bullet_count: int
    description_word_count: int
    has_warranty: int
    has_compatability: int
    launch_month: int
    atomic_category: str
    broad_category: str
    store: str
    # 👈 2. Changed to field_validator and gave it a UNIQUE name
    @field_validator('has_warranty', 'has_compatability')
    @classmethod
    def validate_binary_fields(cls, v):
        if v not in [0, 1]:
            raise ValueError('Must be 0 or 1')
        return v

    # 👈 3. Gave this one a UNIQUE name too so nothing is overwritten
    @field_validator('launch_month')
    @classmethod
    def validate_launch_month(cls, v):
        if v not in range(1, 13):  # Clean shorthand for numbers 1 to 12
            raise ValueError('Must be from 1 to 12')
        return v


class PredictionHistoryResponse(BaseModel):

    id: int

    product_name: str

    broad_category: str

    atomic_category: str

    store: str

    prediction_label: str

    success_percentage: float

    probability_score: float

    risk_level: str

    median_price: float | None = None
    median_weight: float | None = None
    median_feature_bullets: float | None = None
    median_description_words: float | None = None
    competition_index: float | None = None
    input_data: PredictionRequest | None = None
    stratergy_reports: dict | None = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# class DashboardResponse(BaseModel):
#     total_predictions: int
#     success_predictions: int
#     failure_predictions: int
#     avg_success_score: float