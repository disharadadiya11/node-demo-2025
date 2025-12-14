require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { corsOptions } = require("./config");
const errorHandler = require("./middlewares/error.middleware");
const { apiLimiter } = require("./middlewares/rateLimiter.middleware");

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(
  morgan("combined", {
    stream: { write: (message) => console.log(message.trim()) },
  })
);

// Raw body parser for Stripe webhooks (must be before JSON parser)
app.use(
  "/webhooks/stripe",
  express.raw({ type: "application/json" })
);

// JSON and URL-encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/", routes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
