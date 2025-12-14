const mongoose = require("mongoose");
const { DB_URI, NODE_ENV } = require("./env");

let connection = null;

const connectDB = async () => {
  try {
    if (connection) {
      return connection;
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    connection = await mongoose.connect(DB_URI, options);

    console.log(`MongoDB Connected: ${connection.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.log(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

    return connection;
  } catch (error) {
    console.log(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    if (connection) {
      await mongoose.connection.close();
      connection = null;
      console.log("MongoDB disconnected");
    }
  } catch (error) {
    console.log(`Error disconnecting MongoDB: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  mongoose,
};
