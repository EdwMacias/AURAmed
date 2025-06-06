import json
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta, date
from fastapi.middleware.cors import CORSMiddleware

import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://172.28.244.160:5173"], # url local debido a uso de docker y compatiblidad con WSL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class GenerateInput(BaseModel):
    prompt: str
    model: str = "deepseek-r1:7b"  # Nombre exacto del modelo que tienes
    stream: bool = False
    dates: list = []

class AvailableDatesResponse(BaseModel):
    available_dates: list[str]
    
def parse_date(d: str) -> date:
    try:
        return datetime.fromisoformat(d).date()
    except ValueError:
        return datetime.strptime(d, "%Y-%m-%d").date()

def get_available_dates():
    try:
        response = requests.get("http://172.28.244.160:3000/api/", timeout=10) # url local debido a uso de docker y compatiblidad con WSL
        response.raise_for_status()
        eventos = response.json().get("response", [])

        fechas_ocupadas = set()
        for evento in eventos:
            inicio = parse_date(evento["start"])
            fin = parse_date(evento["end"])
            delta = (fin - inicio).days
            for i in range(delta):
                fechas_ocupadas.add(str(inicio + timedelta(days=i)))

        hoy = date.today()
        disponibles = [
            str(hoy + timedelta(days=i)) for i in range(15)
            if str(hoy + timedelta(days=i)) not in fechas_ocupadas
        ]
        return disponibles

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail={
            "error": str(e),
            "backend_status": getattr(e.response, 'status_code', None),
            "backend_response": getattr(e.response, 'text', None)
        })

def extraer_json_de_texto(texto: str) -> dict:
    try:
        matches = re.findall(r"\{.*?\}", texto, re.DOTALL)
        if matches:
            return json.loads(matches[-1])
    except json.JSONDecodeError:
        pass
    return {}

def accion_ver_fechas():
    fechas = get_available_dates()
    return {
        "accion": "ver-fechas",
        "mensaje": "Estas son las fechas disponibles para tu cita:\n" + "\n".join(f"- {f}" for f in fechas),
        "fechas": fechas
    }

def accion_apartar_cita():
    fechas = get_available_dates()
    return {
        "accion": "apartar-cita",
        "mensaje": "Estas son las fechas disponibles para agendar tu cita:\n" + "\n".join(f"- {f}" for f in fechas),
        "fechas": fechas
    }

def accion_confirmar_cita(evento: dict):
    if not evento:
        raise HTTPException(status_code=400, detail="Evento no proporcionado")

    try:
        response = requests.post(
            "http://172.28.244.160:3000/api/createEvent",  # Tu endpoint real
            json=evento,
            timeout=10
        )
        response.raise_for_status()

        return {
            "accion": "confirmar-cita",
            "mensaje": f"Cita confirmada para {evento.get('summary', 'sin título')} el {evento['start']['dateTime']}"
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail={
            "error": str(e),
            "status_code": getattr(e.response, 'status_code', None),
            "backend_response": getattr(e.response, 'text', None)
        })



# Tabla de acciones
tabla_acciones = {
    "ver-fechas": lambda parsed: accion_ver_fechas(),
    "apartar-cita": lambda parsed: accion_apartar_cita(),
    "confirmar-cita": lambda parsed: accion_confirmar_cita(parsed.get("evento")),
}

@app.get("/available-dates", response_model=AvailableDatesResponse)
def obtener_fechas_disponibles():
    fechas = get_available_dates()
    return {"available_dates": fechas}

@app.post("/generate")
def generar_texto(input: GenerateInput):
    ollama_url = f"{os.getenv('OLLAMA_URL', 'http://ollama:11434')}/api/generate"

    prompt_final = (
        "Actúa como un asistente virtual para agendar citas médicas. Tu única salida debe ser en formato JSON válido. No expliques nada, no incluyas ningún texto fuera del JSON.\n"
        "Ejemplos:\n"
        "Usuario: quiero ver fechas disponibles\n"
        'Respuesta: { "accion": "ver-fechas" }\n\n'
        "Usuario: quiero agendar una cita\n"
        'Respuesta: { "accion": "apartar-cita" }\n\n'
        "Usuario: sí, confírmala para el lunes con el cardiólogo, a las 10am, correo juan@mail.com\n"
        'Respuesta: { "accion": "confirmar-cita", "evento": { "summary": "Consulta con cardiólogo", "location": "Consultorio 3", "description": "Consulta médica", "start": { "dateTime": "2025-06-07T10:00:00", "timeZone": "America/Bogota" }, "end": { "dateTime": "2025-06-07T10:30:00", "timeZone": "America/Bogota" }, "attendees": [ { "email": "juan@mail.com" } ], "reminders": { "useDefault": true } } }\n\n'
        f"Usuario: {input.prompt}"
    )


    try:
        response = requests.post(
            ollama_url,
            json={
                "model": input.model,
                "prompt": prompt_final,
                "stream": input.stream
            },
            timeout=30
        )
        response.raise_for_status()
        respuesta_modelo = response.json().get("response", "").strip()
        print(f"Respuesta del modelo: {respuesta_modelo}")

        parsed = extraer_json_de_texto(respuesta_modelo)
        accion = (parsed.get("accion") or parsed.get("action") or "").lower()

        if accion in tabla_acciones:
            return tabla_acciones[accion](parsed)

        return {"respuesta": parsed or respuesta_modelo}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail={
            "error": str(e),
            "ollama_status": getattr(e.response, 'status_code', None),
            "ollama_response": getattr(e.response, 'text', None)
        })
