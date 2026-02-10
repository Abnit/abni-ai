from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import re
import math
from datetime import datetime

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "ABNI Agent Backend Running"}

@app.post("/api/chat")
async def chat_endpoint(request: QueryRequest):
    query = request.text.lower().strip()
    response_text = ""
    action = None
    data = None

    # 1. Math Calculation
    # Simple regex for "calculate" or direct math
    if "calculate" in query or re.search(r'\d+\s*[\+\-\*\/]\s*\d+', query):
        try:
            # Dangerous in prod, but okay for this demo with strict cleaning
            expression = re.sub(r'[^0-9\+\-\*\/\(\)\.]', '', query)
            if expression:
                result = eval(expression)
                response_text = f"The answer is {result}"
        except Exception:
            response_text = "I couldn't calculate that."

    # 2. Time/Date
    elif "time" in query:
        response_text = f"It is currently {datetime.now().strftime('%I:%M %p')}"
    elif "date" in query:
        response_text = f"Today is {datetime.now().strftime('%A, %B %d, %Y')}"

    # 3. Wikipedia / General Knowledge
    if not response_text:
        # Check Wikipedia
        try:
            wiki_search = requests.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "opensearch",
                    "search": request.text,
                    "limit": 1,
                    "namespace": 0,
                    "format": "json"
                }
            ).json()

            if wiki_search[1]:
                title = wiki_search[1][0]
                summary_res = requests.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}").json()
                response_text = summary_res.get('extract', "I found something, but couldn't get the summary.")
                data = {"title": title, "url": summary_res.get('content_urls', {}).get('desktop', {}).get('page')}
            else:
                response_text = "I couldn't find anything on Wikipedia for that."
        except Exception as e:
            print(f"Wiki Error: {e}")
            response_text = "I'm having trouble connecting to my knowledge base."

    return {
        "text": response_text,
        "action": action,
        "data": data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
