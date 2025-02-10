package com.example.backend.websocket.model;

import lombok.Data;

@Data
public class MatchNotification {
    private String matchedUserEmail;
    private String matchedUserId;
    private String collaborationId;
    private String questionId;
    private String language;

    public MatchNotification(String matchedUserEmail, String matchedUserId, String collaborationId, String questionId, String language) {
        this.matchedUserEmail = matchedUserEmail;
        this.matchedUserId = matchedUserId;
        this.collaborationId = collaborationId;
        this.questionId = questionId;
        this.language = language;
    }
}
