import { GoogleCalendarController } from "../controller/GoogleCalendarController.js";
import { GoogleSheetsController } from "../controller/GoogleSheetsController.js";
// import { GoogleCalendarService } from "../service/GoogleCalendarService.js";

// const gooleService = new GoogleCalendarService();
const googleController = new GoogleCalendarController();
const googleSheetsController = new GoogleSheetsController();
export { googleController, googleSheetsController}