// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API con Swagger',
      version: '1.0.0',
      description: 'Documentación de mi API'
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  // Ruta donde Swagger buscará comentarios en tus rutas
  apis: ['./routes/*.js'], // Ajusta la ruta a donde están tus endpoints
};

const swaggerSpec = swaggerJsdoc(options);

export {
  swaggerUi,
  swaggerSpec
};
