import json
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta, date
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()
backend_api_url = os.getenv("BACKEND_API_URL", "http://localhost:3000/api/")
create_event_url = os.getenv("BACKEND_CREATE_EVENT_URL", "http://localhost:3000/api/createEvent")
app.add_middleware(
    CORSMiddleware,
    allow_origins = os.getenv("FRONTEND_URL", "http://localhost:5173")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class GenerateInput(BaseModel):
    prompt: str
    model: str = os.getenv("MODEL_NAME", "deepseek-r1:latest")  # Nombre exacto del modelo que tienes
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
        response = requests.get(backend_api_url, timeout=10)
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

def accion_solicitar_datos(parsed):
    # parsed["faltante"] puede ser lista o string
    faltantes = parsed.get("faltante", [])
    if isinstance(faltantes, str):
        faltantes = [faltantes]
    # Mensaje amigable (podrías mejorarlo aún más)
    campo_map = {
        "nombre": "nombre completo",
        "cedula": "número de cédula",
        "fecha": "fecha de la cita"
    }
    faltan = [campo_map.get(f, f) for f in faltantes]
    if len(faltan) == 1:
        mensaje = f"Por favor, dime tu {faltan[0]} para poder agendar la cita."
    else:
        campos = ", ".join(faltan[:-1]) + " y " + faltan[-1]
        mensaje = f"Por favor, dime tu {campos} para poder agendar la cita."
    return {
        "accion": "solicitar-datos",
        "faltante": faltantes,
        "mensaje": mensaje
    }

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
            create_event_url,  # Tu endpoint real
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
    "solicitar-datos": accion_solicitar_datos,   # <--- NUEVO

}

@app.get("/available-dates", response_model=AvailableDatesResponse)
def obtener_fechas_disponibles():
    fechas = get_available_dates()
    return {"available_dates": fechas}

@app.post("/generate")
def generar_texto(input: GenerateInput):
    ollama_url = f"{os.getenv('OLLAMA_URL', 'http://ollama:11434')}/api/generate"

    prompt_final = (
    "Eres un asistente para agendar citas médicas. "
    "Responde exclusivamente en español y solo sobre agendamiento.\n\n"
    "Reglas:\n"
    "- Si el usuario quiere reservar una cita y proporciona nombre, cédula y fecha, responde SOLO con:\n"
    '{ "accion": "apartar-cita", "nombre": "<NOMBRE>", "cedula": "<CEDULA>", "fecha": "<AAAA-MM-DD>" }\n'
    "- Si falta uno o más datos, responde SOLO con:\n"
    '{ "accion": "solicitar-datos", "faltante": ["nombre", "cedula", "fecha"] }\n'
    "- Si pregunta por fechas disponibles, responde sólo con:\n"
    '{ "accion": "ver-fechas" }\n'
    "- Si confirma una cita y da todos los datos, responde SOLO con el JSON para confirmar cita (formato mostrado abajo).\n"
    '{ "accion": "confirmar-cita", "evento": { "summary": \"...\", \"location\": \"...\", \"description\": \"...\", \"start\": {...}, \"end\": {...}, \"attendees\": [...], \"reminders\": {...} } }\n\n'
    "No agregues explicaciones, ni texto adicional. No uses etiquetas <think> ni comentarios.\n\n"
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
