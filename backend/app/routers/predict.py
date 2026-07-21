from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.security import get_current_user
from app.schemas import PredictionRequest
from app.service.predictor import predict_new_product,generate_stratergy_report
from app.database import get_db
from app import models
from typing import List
from app.schemas import PredictionHistoryResponse

router = APIRouter()



# Protected ML prediction route
@router.post("/predict")
def predict(
    data: PredictionRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    # 1. Fetch user to get correct ID
    user = db.query(models.User).filter(models.User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account session invalid")

    try:
        # 2. Run your Machine Learning model
        result = predict_new_product(data)
        report = result["report"]
        benchmarks = result["benchmarks"]
        stratergy_reports = result["stratergy_reports"]
        # 3. Build database entry mapping ALL columns required by your PostgreSQL table
        new_prediction = models.Prediction(
            user_id=user.id,
            product_name=data.product_name,
            broad_category=data.broad_category,
            atomic_category=data.atomic_category,
            store=data.store,
            prediction_label=report["prediction_label"],
            risk_level=report.get("risk_level", "UNKNOWN"),
            
            # 🌟 Shielding data from NumPy type errors via float() and int()
            success_percentage=float(report["success_percentage"]),
            probability_score=float(report["probability_score"]),
            
            # Additional analytical columns required by your schema
            # Additional analytical columns (Using 'is not None' to protect 0 or 0.0 entries safely)
            median_price=float(benchmarks["median_price"]) if benchmarks.get("median_price") is not None else None,
            median_weight=float(benchmarks["median_weight"]) if benchmarks.get("median_weight") is not None else None,
            median_feature_bullets=int(benchmarks["median_feature_bullets"]) if benchmarks.get("median_feature_bullets") is not None else None,
            median_description_words=int(benchmarks["median_description_words"]) if benchmarks.get("median_description_words") is not None else None,
            competition_index=float(benchmarks["competition_index"]) if benchmarks.get("competition_index") is not None else None,
            input_data=data.model_dump(),
            stratergy_reports=stratergy_reports # Store the strategy report as JSON or string as needed
        )
        
        # 4. Save to PostgreSQL safely
        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        return {
            "user_id": user.id,
            "message": "Prediction completed successfully",
            "prediction_id": new_prediction.id,
            "results": result
        }

    except Exception as e:
        db.rollback()  # Rollback database state if anything goes wrong
        raise HTTPException(status_code=500, detail=f"ML Pipeline Engine Error: {str(e)}")





# for fetching user-specific prediction history
# ─────────────────────────────────────────────
# USER PREDICTION HISTORY
# ─────────────────────────────────────────────
@router.get(
    "/history",
    response_model=List[PredictionHistoryResponse]
)
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):

    predictions = (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == current_user_id)
        .order_by(models.Prediction.created_at.desc())
        .all()
    )

    return predictions
@router.get("/history/{prediction_id}")
def get_prediction_details(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):

    prediction = (
        db.query(models.Prediction)
        .filter(
            models.Prediction.id == prediction_id,
            models.Prediction.user_id == current_user_id
        )
        .first()
    )

    if not prediction:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return prediction

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):

    predictions = (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == current_user_id)
        .all()
    )

    total_predictions = len(predictions)

    success_predictions = sum(
        1 for p in predictions
        if p.prediction_label == "SUCCESS"
    )

    failure_predictions = total_predictions - success_predictions

    avg_success_score = round(
        sum(p.success_percentage for p in predictions) /
        total_predictions,
        2
    ) if total_predictions else 0

    recent_predictions = [
        {
            "id": p.id,
            "product_name": p.product_name,
            "success_percentage": p.success_percentage,
            "risk_level": p.risk_level
        }
        for p in predictions[-5:]
    ]

    return {
        "total_predictions": total_predictions,
        "success_predictions": success_predictions,
        "failure_predictions": failure_predictions,
        "avg_success_score": avg_success_score,
        "recent_predictions": recent_predictions
    }

@router.get("/protected-test")
def test(current_user_id: int = Depends(get_current_user)):  # Fixed type and naming consistency
    return {"user_id": current_user_id}