import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import {GoogleAuth} from 'google-auth-library';
import {configApplication} from '../config/configApplication.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive'
];

const TOKEN_PATH = path.join(process.cwd(), 'token-sheets.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials-sheets.json');

export class GoogleSheetsService {

  async authenticate() {

    return  new GoogleAuth({
      keyFile: path.join(__dirname, '../credential-google-sheets.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  async createGoogleSheet() {
    const auth = this.authenticate();
    const versionGoogleSheets = configApplication.versionGoogleSheets;
    const service = google.sheets({ version: versionGoogleSheets, auth });
  
    const resource = {
      properties: {
        title: 'example',
      },
      sheets: [
        {
          properties: {
            title: 'Hoja 1',
          },
        },
      ],
    };
  
    try {
      // const spreadsheet = await service.spreadsheets.create({
      //   resource,
      //   fields: 'spreadsheetId',
      // });
  
      // console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
  
      const respuestaCrear= await service.spreadsheets.values.append({
        spreadsheetId: "12_cPMP88DMR0RyS_BzPfLunoZ1P_Idga2eo5ngw8ZS0",
        range: 'Hoja 1!A1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [
            ['Nombre', 'Correo', 'Cargo'],
            ['Jhonny', 'jhonny@minaslaaurora.com', 'Técnico'],
          ],
        },
      });
     return await this.shareSheetWithUser(spreadsheet.data.spreadsheetId);

    } catch (err) {
      console.log({ err });
    }
  }

  async createRegister(eventData){
    const fields = Object.keys(eventData);
    const values = Object.values(eventData);

    const auth = new GoogleAuth({
      keyFile: path.join(__dirname, '../credential-google-sheets.json'),
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
  
    const service = google.sheets({ version: 'v4', auth });
    console.log(fields, values);
    
    const respuestaCrear= await service.spreadsheets.values.append({
      spreadsheetId: "12_cPMP88DMR0RyS_BzPfLunoZ1P_Idga2eo5ngw8ZS0",
      range: 'Hoja 1!A1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          null,
          values,
        ],
      },
    });
    console.log({respuestaCrear});

    return respuestaCrear;
  //  return await this.shareSheetWithUser(spreadsheet.data.spreadsheetId);
  }




  async  shareSheetWithUser(spreadsheetId) {
    const auth = new GoogleAuth({
      keyFile: path.join(__dirname, '../credential-google-sheets.json'),
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({ version: 'v3', auth });
  
    try {
      const res = await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          type: 'user',
          role: 'writer',
          emailAddress: configApplication.emailClient,
        },
        fields: 'id',
      });
  
      return res;
    } catch (error) {
      console.error('❌ Error al compartir:', error);
    }
  }
  
  
}
