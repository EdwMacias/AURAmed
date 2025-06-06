
import { GoogleSheetsService } from '../service/GoogleSheetsService.js';

const gooleService = new GoogleSheetsService();
export class GoogleSheetsController {

  async crearLibro(req, res) {
    const response =  await gooleService.createGoogleSheet();
    res.json(response);
  }
}