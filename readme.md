# AURAmed -asistente de agendamiento de Citas Médicas usando IA local

Una API inteligente construida con FastAPI, frontend con ReactJS y express.JS que integra modelos de lenguaje (LLM) para facilitar el agendamiento de citas médicas a través de conversaciones naturales en español.

## 🚀 Características

- **Interacción Natural**: Conversaciones en español con procesamiento de lenguaje natural
- **Detección Inteligente**: Identifica automáticamente la intención del usuario
- **Respuestas Estructuradas**: Todas las respuestas en formato JSON para fácil integración
- **Gestión de Datos**: Solicita automáticamente información faltante
- **Arquitectura Modular**: Código fácil de extender y mantener

## 📋 Requisitos locales

VM o equipo:

- **GPU compatible con CUDA (Nvidia)**.
- Docker
- Python 3.10+


## 🛠️ Instalación

1. **Clona el repositorio**:
```bash
git clone <url-del-repositorio>
cd AURAmed
```

2. **Instala las dependencias**:
```bash
chmod +x levantar-ollama.sh
./levantar-ollama.sh
```


## 📡 Endpoints

### `POST /generate`

Procesa el mensaje del usuario y responde según la intención identificada.

**Request**:
```json
{
  "prompt": "Quiero una cita para mañana, me llamo Juan Pérez y mi cédula es 1012345678",
  "model": "deepseek-r1:latest"
}
```

**Respuestas posibles**:

#### Apartar Cita
```json
{
  "accion": "apartar-cita",
  "nombre": "Juan Pérez",
  "cedula": "1012345678",
  "fecha": "2025-06-07"
}
```

#### Solicitar Datos Faltantes
```json
{
  "accion": "solicitar-datos",
  "faltante": ["cedula"],
  "mensaje": "Por favor, dime tu número de cédula para poder agendar la cita."
}
```

#### Mostrar Fechas Disponibles
```json
{
  "accion": "ver-fechas",
  "mensaje": "Estas son las fechas disponibles para tu cita:\n- 2025-06-07\n- 2025-06-08...",
  "fechas": ["2025-06-07", "2025-06-08", "2025-06-09"]
}
```

#### Confirmar Cita
```json
{
  "accion": "confirmar-cita",
  "mensaje": "Cita confirmada para Juan Pérez el 2025-06-07T14:00:00-05:00"
}
```

### `GET /available-dates`

Devuelve las fechas disponibles para agendar citas.

**Response**:
```json
{
  "available_dates": ["2025-06-07", "2025-06-08", "2025-06-09"]
}
```

## 🔄 Flujo de Trabajo

### Ejemplo de Conversación Completa

1. **Usuario**: "Quiero una cita para el lunes."
   
   **API Responde**:
   ```json
   {
     "accion": "solicitar-datos",
     "faltante": ["nombre", "cedula"],
     "mensaje": "Por favor, dime tu nombre completo y número de cédula para poder agendar la cita."
   }
   ```

2. **Usuario**: "Mi nombre es Laura Díaz, cédula 123456789."
   
   **API Responde**:
   ```json
   {
     "accion": "apartar-cita",
     "nombre": "Laura Díaz",
     "cedula": "123456789",
     "fecha": "2025-06-09"
   }
   ```

## 🧠 Lógica de Acciones

La API identifica automáticamente una de estas acciones:

- **`ver-fechas`**: Muestra fechas disponibles
- **`apartar-cita`**: Reserva una cita (requiere todos los datos)
- **`confirmar-cita`**: Confirma y agenda la cita con detalles completos
- **`solicitar-datos`**: Solicita información faltante al usuario

## 🔧 Configuración

### Variables de Entorno (Opcional)

```bash
# URL del modelo LLM
LLM_BASE_URL=http://localhost:11434

# Modelo a utilizar
LLM_MODEL=deepseek-r1:latest

# Puerto de la API
API_PORT=8000
#Puerto frontend
FRONTEND_PORT=5173
#Puerto backend
BACKEND_PORT=3000
#Puerto Ollama
OLLAMA_PORT=11434
```

## 📦 Estructura del Proyecto

```
AURAmed/
│
├─ docker-compose.yml
│
├─ ia-models/
│    └─ Dockerfile         # Para el servicio api (FastAPI)
│    └─ ...                # Código fuente FastAPI
│
├─ backend/
│    └─ Dockerfile         # Para el servicio backend (Node.js, Express, etc.)
│    └─ ...                # Código fuente backend
│
└─ frontend/
     ├─ iatools/
     │    └─ Dockerfile    # Para el servicio frontend (Vite, React, etc.)
     │    └─ ...           # Código fuente del frontend (Vite project)
     │
     └─ ...                # El resto del frontend si hay más carpetas/archivos
```

## 🧪 Pruebas

### Con curl
```bash
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hola, necesito una cita médica",
    "model": "deepseek-r1:latest"
  }'
```

### Con Python
```python
import requests

response = requests.post(
    "http://localhost:8000/generate",
    json={
        "prompt": "Quiero agendar una cita para el viernes",
        "model": "deepseek-r1:latest"
    }
)
print(response.json())
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- Abre un issue en el repositorio
- Contacta al equipo de desarrollo

## 🔮 Próximas Características

- [ ] Integración con Google Calendar
- [ ] Notificaciones por email/SMS y/o Whatsapp
- [ ] Soporte para múltiples especialidades médicas
- [ ] Dashboard de administración
- [ ] API de reportes y estadísticas

---

**Nota**: Esta API está diseñada para trabajar exclusivamente con temas de agendamiento médico y responde únicamente en español con formato JSON estructurado para alojar nuevas funcionalidades.
