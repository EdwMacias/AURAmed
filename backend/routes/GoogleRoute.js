import { Router } from "express";
import { googleController } from "../config/GoogleConfig.js";



const googleCalendarRouter = Router();

googleCalendarRouter.get("/", (req, res)=>googleController.getEvents(req, res));
// googleCalendarRouter.get("/", (req, res)=>googleController.createEvent(req.body));

export  {googleCalendarRouter};