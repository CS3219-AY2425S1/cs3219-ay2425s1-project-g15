import { COLLABORATION_SERVICE } from "@/api/collaboration";
import { ChatLog, SingleChatLogApiResponse } from "@/types/chat";


export const getChatlogs = async (collabid: string, page_num: number, limit: number): Promise<ChatLog[]> => {
    const url = `${COLLABORATION_SERVICE}/chat/${collabid}/get_chatlogs?page=${page_num}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    const formattedChatLogs = data.chatLogs.map((chatLog: SingleChatLogApiResponse) => {
        return {
            collabid: chatLog.collabid,
            message: chatLog.message,
            senderId: chatLog.senderId,
            recipientId: chatLog.recipientId,
            timestampFormatted: chatLog.timestampFormatted,
        };
    })
    return formattedChatLogs;
}
