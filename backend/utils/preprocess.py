def preprocess_symptoms(symptoms: list[str]) -> list[float]:
    # Example: Convert symptoms to one-hot or use your encoder
    # Replace this with real logic
    all_symptoms = ["fever", "cough", "headache", "fatigue"]
    return [1 if s in symptoms else 0 for s in all_symptoms]
