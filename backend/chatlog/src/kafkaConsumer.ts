// // src/kafkaConsumer.ts
import { EachMessagePayload, Kafka } from 'kafkajs';
import ChatLog, { IChatLog } from './models/ChatLog';

// // Kafka Configuration
const kafka = new Kafka({
  clientId: 'my-id',
  brokers: ['localhost:9092'] // Change this if needed
});

const consumer = kafka.consumer({ groupId: 'chat-logs-group' });

async function startConsumer(): Promise<void> {
  await consumer.connect();
  await consumer.subscribe({ topic: 'CHATLOGS', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      const chatLog = JSON.parse(message.value?.toString() || '{}');
      console.log("Message consumed: " + chatLog)

      // Save message to MongoDB
      const newChatLog: IChatLog = new ChatLog({
        senderId: chatLog.senderId,
        message: chatLog.message,
        timestamp: new Date(chatLog.timestamp)
      });

      await newChatLog.save();
      console.log('Chat log saved to MongoDB:', newChatLog);
    },
  });
}

export default startConsumer;
