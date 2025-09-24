# ml_test.py
import torch
from sentence_transformers import SentenceTransformer
import spacy
from transformers import pipeline
import openai

print("🔥 Torch version:", torch.__version__)

# Sentence Transformer test
model = SentenceTransformer("all-MiniLM-L6-v2")
emb = model.encode("ReWear is an AI-powered clothing swap app")
print("✅ Sentence embedding shape:", emb.shape)

# HuggingFace Transformers test
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
summary = summarizer("ReWear helps users swap clothes online, add AI features, and personalize recommendations.", max_length=30, min_length=5, do_sample=False)
print("✅ HuggingFace summarizer output:", summary)

# spaCy test
nlp = spacy.load("en_core_web_sm")
doc = nlp("ReWear recommends red dresses under 1000 points")
print("✅ spaCy tokens:", [token.text for token in doc])

openai.api_key = "sk-..."  # set your real key here or via env
try:
    from openai import OpenAI
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Write one sentence about ReWear app."}]
    )
    print("✅ OpenAI response:", response.choices[0].message.content)
except Exception as e:
    print("⚠️ OpenAI test skipped (no API key):", e)
