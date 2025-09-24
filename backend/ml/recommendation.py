import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from users.models import Item
import numpy as np

def get_recommendations(user_id, top_n=5):
    items = Item.objects.all().values("id", "title", "category", "points", "rating", "image_features")
    df = pd.DataFrame(items)

    if df.empty:
        return []

    df["category_encoded"] = df["category"].astype("category").cat.codes

    feature_matrix = []
    for _, row in df.iterrows():
        if row['image_features']:
            feature_matrix.append(row['image_features'])
        else:
            feature_matrix.append([row['points'], row['rating'], row['category_encoded']])
    feature_matrix = np.array(feature_matrix)

    sim_matrix = cosine_similarity(feature_matrix)

    user_items = Item.objects.filter(uploader_id=user_id)
    if not user_items.exists():
        return list(df.sample(min(top_n, len(df)))["id"].values)

    liked_indices = df.index[df["id"].isin([item.id for item in user_items])]
    sim_scores = sim_matrix[liked_indices].mean(axis=0)

    top_indices = np.argsort(sim_scores)[::-1]
    top_items = []
    for idx in top_indices:
        if df.iloc[idx]["id"] not in [item.id for item in user_items]:
            top_items.append(df.iloc[idx]["id"])
        if len(top_items) >= top_n:
            break

    return top_items
