import mongoose, { Document, Schema } from 'mongoose';

interface IChatLog extends Document {
  senderId: string;
  message: string;
  collabId: string;
  recipientId: string;
  timestamp: Date;
}

const chatLogSchema = new Schema<IChatLog>({
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  collabId: { type: String, required: true },
  recipientId: { type: String, required: true }
});

const ChatLogDB = mongoose.connection.useDb("Chatlogs");
export default ChatLogDB.model<IChatLog>('ChatLog', chatLogSchema, "chatlogs");
export { IChatLog };
