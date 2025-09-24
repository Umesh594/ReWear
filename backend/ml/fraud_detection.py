from users.models import SwapRequest
from .models import FraudReport
import numpy as np
from sklearn.ensemble import IsolationForest

def detect_anomalous_swaps():
    # Example features: points, rating, views
    swaps = SwapRequest.objects.all()
    features = []
    swap_ids = []
    
    for swap in swaps:
        # Customize features based on available fields
        features.append([
            swap.item.points or 0,
            swap.item.rating or 0,
            swap.item.views or 0
        ])
        swap_ids.append(swap.id)
    
    if not features:
        return []

    features = np.array(features)
    clf = IsolationForest(contamination=0.05, random_state=42)
    preds = clf.fit_predict(features)  # -1 = anomaly, 1 = normal
    scores = clf.score_samples(features)

    anomalous_ids = [swap_ids[i] for i, p in enumerate(preds) if p == -1]

    # Store flagged swaps in DB
    for i, swap_id in enumerate(anomalous_ids):
        swap = SwapRequest.objects.get(id=swap_id)
        FraudReport.objects.get_or_create(
            swap=swap,
            defaults={"score": float(scores[swap_ids.index(swap_id)])}
        )

    return anomalous_ids
