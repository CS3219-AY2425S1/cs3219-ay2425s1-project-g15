package com.example.backend.websocketchat.model;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;

import lombok.Data;

@Data
public class MessageForwarded {
    String message;
    String collabId;
    String recipientId;
    String senderId;
    OffsetDateTime timestamp;

    public MessageForwarded(String message, String collabId, String senderId, String recipientId, OffsetDateTime timestamp) {
        this.message = message;
        this.collabId = collabId;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.timestamp = timestamp;
    }

    public OffsetDateTime timestamp() {
        return this.timestamp;
    }

    public String getSenderId() {
        return this.senderId;
    }

    public String getMessage() {
        return this.message;
    }

    public String getCollabId() {
        return this.collabId;
    }

    public String getRecipientId() {
        return this.recipientId;
    }
}
