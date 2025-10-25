import spacy
nlp = spacy.load("en_core_web_sm")
def parse_query(query: str):
    doc = nlp(query)
    filters = {}
    for ent in doc.ents:
        ent_text = ent.text.strip()
        ent_label = ent.label_
        try:
            val = float(ent_text.replace("$","").replace(",",""))
            if "under" in query.lower() or "below" in query.lower():
                filters.setdefault(ent_label, {})["max"] = val
            elif "over" in query.lower() or "above" in query.lower():
                filters.setdefault(ent_label, {})["min"] = val
            else:
                filters.setdefault(ent_label, {})["eq"] = val
        except:
            filters.setdefault(ent_label, [])
            if ent_text not in filters[ent_label]:
                filters[ent_label].append(ent_text)
    return filters