import express from "express";
import userRoutes from "./routes/userRoutes";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', userRoutes)

const PORT = process.env.PORT || "3004";
const MONGO_URL = (process.env.NODE_ENV === 'DEV' ? process.env.DEV_MONGO_URL : process.env.PROD_MONGO_URL) || "";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, (err?: Error) => {
      if (err) {
        return console.error(err);
      }
      return console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((err?: Error) => {
    console.error(err);
  });