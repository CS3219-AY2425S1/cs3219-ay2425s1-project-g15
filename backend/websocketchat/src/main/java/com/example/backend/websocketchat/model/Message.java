package com.example.backend.websocketchat.model;

import lombok.Data;

@Data
public class Message {
    private String message;
    private String collabID;
    private String targetID;

    public Message(String message, String collabID, String targetID) {
        this.message = message;
        this.collabID = collabID;
        this.targetID = targetID;
    }

    public String getMessage() {
        return this.message;
    }

    public String getTargetID() {
        return this.targetID;
    }
}
