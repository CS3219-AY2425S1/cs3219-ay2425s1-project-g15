package com.example.backend.websocketchat.model;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

import lombok.Data;

@Data
public class MessageForwarded extends MessageConsumed {
    String senderId;
    ZonedDateTime timestamp;

    public MessageForwarded(String message, String collabID, String senderId, String recipientId, ZonedDateTime timestamp) {
        super(message, collabID, recipientId);
        this.senderId = senderId;
        this.timestamp = timestamp;
    }

    public ZonedDateTime timestamp() {
        return this.timestamp;
    }

    public String getSenderId() {
        return this.senderId;
    }
}
