from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os

app = FastAPI()

class GenerateInput(BaseModel):
    prompt: str
    model: str = "deepseek-r1:latest"  # Nombre exacto del modelo que tienes
    stream: bool = False

@app.post("/generate")
def generar_texto(input: GenerateInput):
    ollama_url = f"{os.getenv('OLLAMA_URL', 'http://ollama:11434')}/api/generate"
    
    try:
        response = requests.post(
            ollama_url,
            json={
                "model": input.model,
                "prompt": input.prompt,
                "stream": input.stream
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        error_detail = {
            "error": str(e),
            "ollama_status": getattr(e.response, 'status_code', None),
            "ollama_response": getattr(e.response, 'text', None)
        }
        raise HTTPException(status_code=500, detail=error_detail)