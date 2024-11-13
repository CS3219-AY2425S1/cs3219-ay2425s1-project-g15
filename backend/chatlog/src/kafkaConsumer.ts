// // src/kafkaConsumer.ts
import { EachMessagePayload, Kafka } from 'kafkajs';
import ChatLog, { IChatLog } from './models/ChatLog';

// // Kafka Configuration
const kafka = new Kafka({
  clientId: 'my-id',
  brokers: ['kafka-service:9092'] 
});

const consumer = kafka.consumer({ groupId: 'chat-logs-group' });

async function startConsumer(): Promise<void> {
  console.log("Starting Chatlog Kafka Consumer");

  while (true) {
    try {
      await consumer.connect();
      console.log("Kafka consumer connected successfully");
      break; // Exit loop on successful connection
    } catch (error) {
      console.error("Failed to connect to Kafka, retrying in 5 seconds...", error);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }

  await consumer.subscribe({ topic: 'CHATLOGS'});

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      const chatLog = JSON.parse(message.value?.toString() || '{}');
      console.log("Message consumed: " + chatLog)

      // Save message to MongoDB
      const newChatLog: IChatLog = new ChatLog({
        senderId: chatLog.senderId,
        collabId: chatLog.collabId,
        recipientId: chatLog.recipientId,
        message: chatLog.message,
        timestamp: new Date(chatLog.timestamp * 1000)
      });

      await newChatLog.save();
      console.log('Chat log saved to MongoDB:', newChatLog);
    },
  });
}

export default startConsumer;
