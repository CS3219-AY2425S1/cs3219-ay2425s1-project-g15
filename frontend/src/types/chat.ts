
export interface SingleChatLogApiResponse {
        _id: string;
        collabid: string;
        message: string;
        senderId: string;
        recipientId: string;
        timestampEpoch: number;
        _v: number;
        timestampFormatted: string;
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
    timestampFormatted: string;
    position: "left" | "right";
    type: "text";
    dateString: string;
  }