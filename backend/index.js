import cors from 'cors';
import express from "express";
import { configApplication } from "./config/configApplication.js";
import { googleCalendarRouter } from "./routes/GoogleRoute.js";
import { swaggerSpec, swaggerUi } from './swagger.js';
const app = express();
app.use(cors());

const host = configApplication.host;
const port = configApplication.port || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());


// app.get("/", (req, res) => {
//   res.send("¡Backend en Node.js con TypeScript funcionando!");
// });
app.use("/api",googleCalendarRouter)


app.listen(port, () => console.log(`Servidor corriendo en http://${host}:${port}`));
