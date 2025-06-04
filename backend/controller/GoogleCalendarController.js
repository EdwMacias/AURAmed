
import { GoogleCalendarService } from '../service/GoogleCalendarService.js';

const gooleService = new GoogleCalendarService();
export class GoogleCalendarController {

    async createEvent(eventData) {
        return await gooleService.createEvent(eventData);
    }
    async getEvents(req, res) {
        console.log({gooleService})
        const response =  await gooleService.listEvents();
        res.send({response});
    }
}