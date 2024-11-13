package com.example.backend.websocketchat.model;

import lombok.Data;

@Data
public class MessageConsumed {
    private String message;
    private String collabId;
    private String recipientId;

    public MessageConsumed(String message, String collabID, String targetID) {
        this.message = message;
        this.collabId = collabID;
        this.recipientId = targetID;
    }

    public String getMessage() {
        return this.message;
    }

    public String getRecipientId() {
        return this.recipientId;
    }

    public String getCollabId() {
        return this.collabId;
    }
}
