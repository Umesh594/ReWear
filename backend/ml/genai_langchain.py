import os
import traceback
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_huggingface import HuggingFacePipeline

MODEL_NAME = os.getenv("TEXT_MODEL", "google/flan-t5-base")
device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME).to(device)

hf_pipe = pipeline(
    task="text2text-generation",
    model=model,
    tokenizer=tokenizer,
    device=0 if device == "cuda" else -1
)
llm = HuggingFacePipeline(pipeline=hf_pipe)

desc_prompt = PromptTemplate(
    input_variables=["title"],
    template="Generate a product description for any item titled '{title}' in 2-3 sentences."
)
style_prompt = PromptTemplate(
    input_variables=["description"],
    template="Based on this description, infer the style, color, and any characteristics dynamically: '{description}'"
)

desc_chain = LLMChain(llm=llm, prompt=desc_prompt)
style_chain = LLMChain(llm=llm, prompt=style_prompt)

def generate_item_description(title: str):
    try:
        if not title:
            return {"description": "", "style_suggestion": "Unknown", "error": "Title is empty"}

        desc_result = desc_chain.run({"title": title})
        style_result = style_chain.run({"description": desc_result})

        return {
            "description": desc_result,
            "style_suggestion": style_result
        }
    except Exception as e:
        tb = traceback.format_exc()
        return {
            "description": f"Error generating description: {str(e)}",
            "error_traceback": tb,
            "style_suggestion": "Unknown"
        }
