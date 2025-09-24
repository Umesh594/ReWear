import spacy

nlp = spacy.load("en_core_web_sm")

def parse_query(query: str):
    doc = nlp(query)
    filters = {}
    for ent in doc.ents:
        if ent.label_ in ["MONEY", "CARDINAL"]:
            try:
                val = float(ent.text.replace("$","").replace(",",""))
                if "under" in query.lower() or "below" in query.lower():
                    filters.setdefault("price", {})["max"] = val
                elif "over" in query.lower() or "above" in query.lower():
                    filters.setdefault("price", {})["min"] = val
                else:
                    filters.setdefault("price", {})["eq"] = val
            except:
                continue
    return filters
