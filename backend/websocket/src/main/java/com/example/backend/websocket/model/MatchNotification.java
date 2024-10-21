package com.example.backend.websocket.model;

import lombok.Data;

@Data
public class MatchNotification {
    private String matchedUserEmail;

    public MatchNotification(String matchedUserEmail) {
        this.matchedUserEmail = matchedUserEmail;
    }
}
