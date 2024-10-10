import express from "express";
import questionRoutes from "./routes/questionRoutes";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

/**
 * The URI for the MongoDB database is defined in the environment variable MONGODB_URI, inside your .env file.
 * If you face the error "MongoParseError", check the naming of your env variable & check that the .env file exists (/question/.env).
 */
const uri = process.env.MONGODB_URI || "";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", questionRoutes);

const PORT = process.env.PORT || "3003";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

if (process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "PRODUCTION") {
  connect();
}

const server = app.listen(PORT, (err?: Error) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`App is running on port ${PORT}`);
});

export { app, server };
