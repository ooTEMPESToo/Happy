import joblib

model = joblib.load("models/final_model.pkl")

def predict_disease(features):
    prediction = model.predict([features])[0]
    confidence = max(model.predict_proba([features])[0]) * 100
    return prediction, round(confidence, 2)
