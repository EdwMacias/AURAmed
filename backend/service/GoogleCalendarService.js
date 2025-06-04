import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export class GoogleCalendarService {
  constructor() {
    this.auth = null;
  }

  async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch {
      return null;
    }
  }

  async saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
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
      if (client.credentials) {
        await this.saveCredentials(client);
      }
    }

    this.auth = client;
    console.log('✅ Autenticado con éxito');
    return client;
  }

  async listEvents() {
    const auth = await this.authorize();
    const calendar = google.calendar({ version: 'v3', auth });

    try {
      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = res.data.items || [];
      if (events.length === 0) {
        console.log('No se encontraron eventos próximos.');
      } else {
        console.log('Próximos 10 eventos:');
        return events.map(event => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
          return {
            // id: event.id,
            summary: event.summary,
            description: event.description,
            start: start,
            end: event.end.dateTime || event.end.date,
          };
        });
      }
    } catch (error) {
      console.error('❌ Error al listar eventos:', error);
    }
  }

  async createEvent(eventData) {
    const auth = await this.authorize();
    const calendar = google.calendar({ version: 'v3', auth });

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: eventData,
      });

      console.log('✅ Evento creado:', response.data.htmlLink);
    } catch (error) {
      console.error('❌ Error al crear el evento:', error);
    }
  }
}
