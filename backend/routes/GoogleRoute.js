import { Router } from "express";
import { googleController, googleSheetsController } from "../config/GoogleConfig.js";



const googleCalendarRouter = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Retorna un las fechas de los eventos del calendario
 *     description: Este retorna las fechas de los eventos.
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: {
 *                           "response": [
 *                               {
 *                                  "summary": "probando, hola edward",
 *                                  "start": "2025-06-05",
 *                                 "end": "2025-06-06"
 *                             },
 *                             {
 *                                 "summary": "Reunión técnica",
 *                                 "description": "Revisión del avance del sistema ERP",
 *                                 "start": "2025-06-05T15:00:00-05:00",
 *                                 "end": "2025-06-06T16:00:00-05:00"
 *                             },
 *                         ]
 *                     }
 */

  
googleCalendarRouter.get("/", (req, res)=>googleController.getEvents(req, res));
/**
 * @swagger
 * /api/createEvent:
 *   post:
 *     summary: Crea un evento en Google Calendar y lo registra en Google Sheets
 *     description: Endpoint para agendar citas automáticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *                 example: Jhonny
 *               location:
 *                 type: string
 *                 example: Oficina central, Cúcuta
 *               description:
 *                 type: string
 *                 example: Revisión de avances del proyecto AuroraCorp.
 *               start:
 *                 type: object
 *                 properties:
 *                   dateTime:
 *                     type: string
 *                     example: 2025-06-06T14:00:00-05:00
 *                   timeZone:
 *                     type: string
 *                     example: America/Bogota
 *               end:
 *                 type: object
 *                 properties:
 *                   dateTime:
 *                     type: string
 *                     example: 2025-06-07T15:00:00-05:00
 *                   timeZone:
 *                     type: string
 *                     example: America/Bogota
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: colaborador1@minaslaaurora.com
 *               reminders:
 *                 type: object
 *                 properties:
 *                   useDefault:
 *                     type: boolean
 *                     example: false
 *                   overrides:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         method:
 *                           type: string
 *                           example: email
 *                         minutes:
 *                           type: integer
 *                           example: 60
 *     responses:
 *       200:
 *         description: Evento creado exitosamente
 */

googleCalendarRouter.post("/createEvent", (req, res)=>googleController.createEvent(req, res));
googleCalendarRouter.post("/googleShet", (req, res)=>googleSheetsController.crearLibro(req, res));

export  {googleCalendarRouter};