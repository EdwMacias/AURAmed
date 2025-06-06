
import { GoogleCalendarService } from '../service/GoogleCalendarService.js';

const gooleService = new GoogleCalendarService();
export class GoogleCalendarController {

    async createEvent(req, res) {
        const datos =  req.body;
        const response = await gooleService.createEvent(datos);
        res.send(response);
    }
    async getEvents(req, res) {
        console.log({gooleService})
        const response =  await gooleService.listEvents();
        res.send({response});
    }
    async deleteEvent(req, res) {
        const { id } = req.params;
        const response = await gooleService.deleteEvent(id);
        res.send(response);
    }
    async createGoogleSheet(req, res) {
        // const datos = req.body;
        const response = await gooleService.createGoogleSheet();
        res.send(response);
    }
}