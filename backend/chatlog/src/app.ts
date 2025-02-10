import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import startConsumer from './kafkaConsumer';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || "3008";
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatlogs';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Start Kafka Consumer
startConsumer().catch(console.error);

// Basic route to verify server is running
app.get('/', (req: Request, res: Response) => {
  res.send('ExpressJS Kafka-MongoDB Server is Running');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
