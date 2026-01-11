const swaggerJsdoc = require("swagger-jsdoc");
const { PORT } = require("../config/env");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node 2026 API",
      version: "1.0.0",
      description: "E-commerce API documentation",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // 🔥 VERY IMPORTANT
  apis: [
    "./src/routes/*.js",
    "./src/modules/**/**/*.routes.js",
    "./src/modules/**/**/*.controller.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
