import express from "express";
import collaborationRoutes from "./routes/collaborationRoutes";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', collaborationRoutes)

const PORT = process.env.PORT || "3001";

app.listen(PORT, (err?: Error) => {
    if (err) {
      return console.error(err);
    }
    return console.log(`App is running on port ${PORT}`);
  });