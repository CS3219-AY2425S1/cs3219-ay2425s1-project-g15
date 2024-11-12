import mongoose, { Document, Schema } from 'mongoose';

interface IChatLog extends Document {
  senderId: string;
  message: string;
  timestamp: Date;
}

const chatLogSchema = new Schema<IChatLog>({
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

export default mongoose.model<IChatLog>('ChatLog', chatLogSchema);
export { IChatLog };
