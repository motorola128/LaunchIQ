import pickle
import pandas as pd
import numpy as np
from pathlib import Path
import shap


# =========================================================
# LOAD MODEL ONCE
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "ml_assets" / "model_assets.pkl"

with open(MODEL_PATH, "rb") as f:
    model_assets = pickle.load(f)

# unpack
le_broad = model_assets["le_broad"]
atomic_enc = model_assets["atomic_enc"]
store_enc = model_assets["store_enc"]

prelaunch_features = model_assets["prelauch_features"]

# Unpack both required models for prediction and SHAP calculation
model_voting = model_assets["model_voting"]
model_xgb = model_assets["model_xgb"]  # Loaded explicitly to prevent NameError

group_stats = model_assets["group_stats"]
store_stats = model_assets["store_stats"]
# shap parts
def generate_stratergy_report(X_predict, model_voting, model_xgb, original_inputs, g_price, current_prob):
    # 1. SHAP Values
    explainer = shap.TreeExplainer(model_xgb)
    shap_values = explainer(X_predict)
    impacts = shap_values.values[0]
    
    drivers = []
    for feat, imp in zip(X_predict.columns, impacts):
        drivers.append({
            "feature": feat, 
            "impact": float(imp),
            "type": "POSITIVE" if imp > 0 else "NEGATIVE"
        })
    # Sort by highest absolute impact
    drivers = sorted(drivers, key=lambda x: abs(x["impact"]), reverse=True)

    # 2. Launch Month Optimization
    best_month = original_inputs['launch_month']
    max_month_prob = current_prob
    for i in range(1, 13):
        temp_X = X_predict.copy()
        temp_X['launch_month'] = i
        temp_prob = model_voting.predict_proba(temp_X)[0][1]
        if temp_prob > max_month_prob:
            max_month_prob = temp_prob
            best_month = i

    # 3. Price Optimization
    best_price = original_inputs['price']
    max_price_prob = current_prob
    test_prices = np.linspace(g_price * 0.5, g_price * 1.5, 20)
    
    for price in test_prices:
        price_X = X_predict.copy()
        price_X['price'] = price
        price_X['tprice_vs_group'] = price / (g_price + 1e-6)
        price_prob = model_voting.predict_proba(price_X)[0][1]
        if price_prob > max_price_prob:
            max_price_prob = price_prob
            best_price = price

    # 4. Return as JSON-ready Dictionary
    return {
        "key_success_drivers": drivers[:10], # Top 10 drivers
        "optimizations": {
            "time_optimization": {
                "current_month": original_inputs['launch_month'],
                "optimal_month": best_month,
                "estimated_gain_percentage": float((max_month_prob - current_prob) * 100)
            },
            "price_optimization": {
                "current_price": original_inputs['price'],
                "optimal_price": float(best_price),
                "estimated_gain_percentage": float((max_price_prob - current_prob) * 100),
                "action": "Lower" if best_price < original_inputs['price'] else ("Raise" if best_price > original_inputs['price'] else "Maintain")
            }
        }
    }
# =========================================================
# PREDICTION FUNCTION
# =========================================================

def predict_new_product(data):

    atomic_category = data.atomic_category
    broad_category = data.broad_category
    store = data.store

    # category stats
    grp = group_stats[group_stats['atomic_category'] == atomic_category]

    if len(grp) == 0:

        fallback = {
            'tgroup_price_median': group_stats['tgroup_price_median'].median(),
            'tgroup_weight_median': group_stats['tgroup_weight_median'].median(),
            'tgroup_desc_median': group_stats['tgroup_desc_median'].median(),
            'tgroup_features_median': group_stats['tgroup_features_median'].median(),
            'tgroup_n_counts': group_stats['tgroup_n_counts'].median(),
        }

        grp = pd.DataFrame([fallback])

    g_price = grp['tgroup_price_median'].values[0]
    g_weight = grp['tgroup_weight_median'].values[0]
    g_desc = grp['tgroup_desc_median'].values[0]
    g_feat = grp['tgroup_features_median'].values[0]
    g_n = grp['tgroup_n_counts'].values[0]

    EPS = 1e-6

    # create dataframe
    row = pd.DataFrame([{
        'price': data.price,
        'weight': data.weight,
        'feature_word_count': data.feature_word_count,
        'features_bullet_count': data.features_bullet_count,
        'description_word_count': data.description_word_count,
        'has_warranty': data.has_warranty,
        'has_compatability': data.has_compatability,
        'launch_month': data.launch_month,

        'tgroup_price_median': g_price,
        'tgroup_weight_median': g_weight,
        'tgroup_desc_median': g_desc,
        'tgroup_features_median': g_feat,

        'tprice_vs_group': data.price / (g_price + EPS),
        'tweight_vs_group': data.weight / (g_weight + EPS),
        'tdesc_vs_group': data.description_word_count / (g_desc + EPS),
        'tfeatures_vs_group': data.features_bullet_count / (g_feat + EPS),

        'tis_lighter': int(data.weight < g_weight),

        'tlog_competition': np.log1p(g_n),
    }])

    # encodings
    row['broad_category_enc'] = le_broad.transform(
        pd.DataFrame([{'broad_category': broad_category}])
    )['broad_category'].values[0]

    row['atomic_enc'] = atomic_enc.transform(
        pd.DataFrame([{'atomic_category': atomic_category}])
    )['atomic_category'].values[0]

    row['store_enc'] = store_enc.transform(
        pd.DataFrame([{'store': store}])
    )['store'].values[0]

    # final features
    X_predict = row[prelaunch_features]

    # predict
    prob = model_voting.predict_proba(X_predict)[0][1]
    percentage = round(prob * 100, 1)
    label = "SUCCESS" if prob >= 0.5 else "FAILURE"

    risk = (
        "LOW RISK" if prob >= 0.70 else
        "MODERATE RISK" if prob >= 0.45 else
        "HIGH RISK"
    )
    
    stratergy_data = generate_stratergy_report(
        X_predict=X_predict,
        model_voting=model_voting, 
        model_xgb=model_xgb,
        original_inputs=data.model_dump(),
        g_price=g_price, # Pass the median price you already calculated
        current_prob=float(prob)
)

    return {
        "report": {
            "product_name": data.product_name,
            "broad_category": broad_category,
            "atomic_category": atomic_category,
            "store": store,
            "prediction_label": label,
            "success_percentage": percentage,
            "probability_score": round(prob, 4),
            "risk_level": risk
        },
        "benchmarks": {
            "median_price": round(g_price, 2),
            "median_weight": round(g_weight, 2),
            "median_feature_bullets": round(g_feat, 2),
            "median_description_words": round(g_desc, 2),
            "competition_index": round(float(np.log1p(g_n)), 4)
        },
        "stratergy_reports": stratergy_data
    }