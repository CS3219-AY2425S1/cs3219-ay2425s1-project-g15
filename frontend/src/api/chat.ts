import { ChatLog, SingleChatLogApiResponse } from "@/types/chat";

interface ChatMetaDataShape {
    senderId: string
    senderName: string
    recipientId: string
    recipientName: string
}

export const COLLABORATION_SERVICE = "http://34.54.37.142/api/collaboration";

export const getChatlogs = async (collabid: string, page_num: number, limit: number, chatMetaData: ChatMetaDataShape): Promise<ChatLog[]> => {
    const url = `${COLLABORATION_SERVICE}/chat/${collabid}/get_chatlogs?page=${page_num}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    const formattedChatLogs = data.chatLogs.map((chatLog: SingleChatLogApiResponse) => {
        return {
            text: chatLog.message,
            title: chatLog.senderId === chatMetaData.senderId ? chatMetaData.senderName : chatMetaData.recipientName,
            date: new Date(chatLog.timestamp),
            position: chatLog.senderId === chatMetaData.senderId ? "right" : "left",
            type: "text"
        };
    })
    return formattedChatLogs;
}
