import cors from 'cors';
import express from "express";
import { configApplication } from "./config/configApplication.js";
import { googleCalendarRouter } from "./routes/GoogleRoute.js";
const app = express();
app.use(cors());

const host = configApplication.host|| "localhost";
const port = configApplication.port || 3000;

app.use(express.json());


// app.get("/", (req, res) => {
//   res.send("¡Backend en Node.js con TypeScript funcionando!");
// });
app.use("/api",googleCalendarRouter)


app.listen(port, () => console.log(`Servidor corriendo en http://${host}:${port}`));
