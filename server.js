require("dotenv/config");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const app = express();
// const router = require("./src/routes/index.route");
// const {
//   applyAuthMiddleware,
// } = require("./src/middleware/auth/apply.middleware");
// const { dbConnection } = require("./src/database/connection");

// ---------------------------------------------- [ db connection ]
// dbConnection();

// ---------------------------------------------- [ middleware ]
app.use(cors());

app.use(morgan("tiny"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// [ authentication ]
// app.use(applyAuthMiddleware);

// [ Routes ]
// app.use("/", router);

app.get("/", (req, res) => {
  console.log("Server is running...");
  res.send("🚀 Server is running successfully!");
});

// ---------------------------------------------- [ server ]
app.listen(process.env.PORT, () => {
  console.log(`server listening on ${process.env.PORT}`);
});
