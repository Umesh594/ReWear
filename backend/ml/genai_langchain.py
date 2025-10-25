import traceback
import json
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os
MODEL_NAME = os.getenv("TEXT_MODEL", "google/flan-t5-large")
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME).to(device)
hf_pipe = pipeline(
    task="text2text-generation",
    model=model,
    tokenizer=tokenizer,
    device=0 if device == "cuda" else -1,
    max_new_tokens=150,      
    do_sample=True,
    top_p=0.9,
    temperature=0.7
)
llm = HuggingFacePipeline(pipeline=hf_pipe)
desc_prompt = PromptTemplate(
    input_variables=["title"],
    template="""
You are an expert e-commerce copywriter.
Write a **realistic, engaging Amazon-style product description** in 2-3 sentences for the following product title.
Title: '{title}'
Example output for "Red Cotton Jacket": "Stay warm and stylish with this vibrant red cotton jacket, perfect for casual outings or weekend adventures. Made from breathable cotton, it offers comfort without compromising on style."
Now write the description for the given title:
"""
)
style_prompt = PromptTemplate(
    input_variables=["description"],
    template="""
You are an expert e-commerce analyst.
From this product description, generate a **valid JSON object** with the keys: 'style', 'color', 'material', 'tags'.
Ensure the JSON is valid and each value is meaningful for e-commerce.
Description: '{description}'
"""
)
desc_chain = LLMChain(llm=llm, prompt=desc_prompt)
style_chain = LLMChain(llm=llm, prompt=style_prompt)
def generate_item_description(title: str):
    """
    Generate an Amazon-style product description and structured style info.
    Returns:
    {
        "description": <text description>,
        "style_info": {
            "style": ...,
            "color": ...,
            "material": ...,
            "tags": ...
        }
    }
    """
    if not title.strip():
        return {"description": "", "style_info": {}, "error": "Title is empty"}
    try:
        desc_result = desc_chain.run({"title": title}).strip()
        style_result_raw = style_chain.run({"description": desc_result})
        try:
            style_result = json.loads(style_result_raw)
        except Exception:
            style_result = {"raw_output": style_result_raw}
        return {"description": desc_result, "style_info": style_result}
    except Exception as e:
        tb = traceback.format_exc()
        return {
            "description": f"Error generating description: {str(e)}",
            "style_info": {},
            "error_traceback": tb
        }