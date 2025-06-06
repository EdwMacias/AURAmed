import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

import { GoogleSheetsService } from './GoogleSheetsService.js';
import { configApplication } from '../config/configApplication.js';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export class GoogleCalendarService {
  constructor() {
    this.auth = null;
    this.googleSheetsService = new GoogleSheetsService();
  }

  async loadSavedCredentialsIfExist() {
    try {
      const credentials = JSON.parse(await fs.readFile(TOKEN_PATH));
      return google.auth.fromJSON(credentials);
    } catch {
      return null;
    }
  }

  async saveCredentials(client) {
    const keys = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  async authorize() {
    if (this.auth) return this.auth;

    let client = await this.loadSavedCredentialsIfExist();
    if (!client) {
      client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      });
      if (client.credentials) await this.saveCredentials(client);
    }

    this.auth = client;
    // console.log('✅ Autenticado con éxito');
    return client;
  }

  async listEvents() {
    try {
      const auth = await this.authorize();
      const calendar = google.calendar({
        version: configApplication.versionGoogleCalendar,
        auth,
      });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      return events.map(({ summary, description, start, end }) => ({
        summary,
        description,
        start: start.dateTime || start.date,
        end: end.dateTime || end.date,
      }));
    } catch (error) {
      // console.error('❌ Error al listar eventos:', error);
      return [];
    }
  }

  async createEvent(eventData) {
    try {
      const auth = await this.authorize();
      const calendar = google.calendar({
        version: configApplication.versionGoogleCalendar,
        auth,
      });

      const { data, status } = await calendar.events.insert({
        calendarId: 'primary',
        resource: eventData,
      });

      if (status === 200) {
        const sheetData = {
          id: data.id,
          summary: data.summary,
          description: data.description,
          location: data.location,
          start: data.start.dateTime || data.start.date,
          end: data.end.dateTime || data.end.date,
        };

        const registerGoogleSheet = await this.googleSheetsService.createRegister(sheetData);

        return {
          message: registerGoogleSheet,
          status: true,
        };
      }

      return {
        message: 'No se pudo crear el evento en Google Sheets',
        status: false,
        responseCalendar: data,
      };
    } catch (error) {
      // console.error('❌ Error al crear el evento:', error);
      return {
        message: 'Error inesperado',
        status: false,
      };
    }
  }
}
