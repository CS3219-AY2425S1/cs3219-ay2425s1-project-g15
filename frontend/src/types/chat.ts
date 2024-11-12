
export interface SingleChatLogApiResponse {
        collabid: string;
        message: string;
        senderId: string;
        recipientId: string;
        timestamp: string;
}

export interface SingleChatLogApi {
    collabid: string;
    message: string;
    senderId: string;
    recipientId: string;
}

export interface GetChatLogsApiResponse {
    message: string;
    chatLogs: SingleChatLogApiResponse[];
}

export interface ChatLog {
    text: string;
    title: string;
    date: Date;
    position: "left" | "right";
    type: "text";
  }