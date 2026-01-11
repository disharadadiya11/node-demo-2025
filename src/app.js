require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const { corsOptions } = require("./config");
const webhookRoutes = require("./webhooks/index");
const { apiLimiter } = require("./middlewares/system/rateLimiter.middleware");
const { errorHandler } = require("./middlewares/system/error.middleware");
const setupSwagger = require("./docs/swagger.loader");

const app = express();

/**
 * Security
 */
app.use(helmet());
app.use(cors(corsOptions));

/**
 * Logging
 */
app.use(morgan("combined"));

/**
 * Webhooks (raw body)
 */
// app.use("/webhooks", webhookRoutes);

/**
 * Body parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Rate limiting
 */
app.use("/api", apiLimiter);

/**
 * Routes
 */
app.use("/", routes);

/* Swagger Docs 🚀 */
setupSwagger(app);

/**
 * Error handler (last)
 */
app.use(errorHandler);

module.exports = app;
