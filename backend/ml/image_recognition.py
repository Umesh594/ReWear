import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
from langchain import OpenAI
from langchain.prompts import PromptTemplate

# ---------------- Global Model ---------------- #
tf_model = MobileNetV2(weights="imagenet", include_top=True)

def load_image_from_url(url):
    import requests
    from io import BytesIO
    resp = requests.get(url)
    arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img

def preprocess_image_cv2(img, target_size=(224,224)):
    img_resized = cv2.resize(img, target_size)
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
    img_array = image.img_to_array(img_rgb)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

def detect_item_type(img):
    x = preprocess_image_cv2(img)
    preds = tf_model.predict(x)
    decoded = decode_predictions(preds, top=1)[0][0]
    return decoded[1]  # e.g., 'jean', 'dress'

def detect_dominant_color(img, k=3):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pixels = img.reshape(-1,3)
    from sklearn.cluster import KMeans
    kmeans = KMeans(n_clusters=k, random_state=0).fit(pixels)
    dominant_color = kmeans.cluster_centers_[0].astype(int)
    return tuple(dominant_color.tolist())

def detect_style_dynamic(item_type, color_rgb):
    prompt_template = PromptTemplate(
        input_variables=["item_type", "color_rgb"],
        template="Item type: {item_type}, Color RGB: {color_rgb}. Describe style, category, and any tags dynamically."
    )
    prompt = prompt_template.format(item_type=item_type, color_rgb=color_rgb)
    llm = OpenAI(temperature=0)
    return llm(prompt).strip()

def detect_item_tags(image_url):
    img = load_image_from_url(image_url)
    item_type = detect_item_type(img)
    color = detect_dominant_color(img)
    style = detect_style_dynamic(item_type, color)
    return {
        "type": item_type,
        "color": color,
        "style": style
    }
