  import express from "express";
  import matchingRoutes from "./routes/matchingRoutes";
  import cors from 'cors';
  import dotenv from 'dotenv';
  dotenv.config();
  
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  app.use('/api', matchingRoutes)
  
  const PORT = process.env.PORT || "3002";
  
  app.listen(PORT, (err?: Error) => {
      if (err) {
        return console.error(err);
      }
      return console.log(`App is running on port ${PORT}`);
    });