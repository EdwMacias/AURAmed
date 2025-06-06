import dotenv from "dotenv";

dotenv.config();
export const configApplication = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
    emailClient: process.env.email_client,
    versionGoogleCalendar: process.env.version_google_calendar,
    versionGoogleSheets: process.env.version_google_sheets,

}