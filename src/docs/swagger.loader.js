const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const setupSwagger = (app) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "Node 2026 API Docs",
    })
  );
};

module.exports = setupSwagger;
