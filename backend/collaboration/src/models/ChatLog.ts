import mongoose, { Schema } from "mongoose";

export type TChatLog = {
    collabid: string;
    message: string;
    senderId: string;
    recipientId: string;
    timestampEpoch: number;
}

export interface IChatLog extends TChatLog, Document {}

const chatLogSchema: Schema = new Schema(
    {
        collabId: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        recipientId: {
            type: String,
            required: true,
        },
        timestampEpoch: {
            type: Number,
            required: true,
        },
    },
    { collection: "chatlogs" }
)

const ChatLogDB = mongoose.connection.useDb("Chatlogs");
const ChatLog = ChatLogDB.model<IChatLog>("ChatLog", chatLogSchema, "chatlogs");

export default ChatLog