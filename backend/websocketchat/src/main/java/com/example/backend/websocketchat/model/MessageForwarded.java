package com.example.backend.websocketchat.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MessageForwarded extends MessageConsumed {
    String senderId;
    LocalDateTime timestamp;

    public MessageForwarded(String message, String collabID, String senderId, String recipientId, LocalDateTime timestamp) {
        super(message, collabID, recipientId);
        this.senderId = senderId;
        this.timestamp = timestamp;
    }

    public LocalDateTime timestamp() {
        return this.timestamp;
    }

    public String getSenderId() {
        return this.senderId;
    }
}
