package com.example.backend.matching.controller;

import lombok.Data;

@Data
public class MatchRequest {
    private String userEmail;
    private String topic;
    private String programmingLanguage;
    private String difficulty;

    public String getMatchCriteriaKey() {
        return topic + "_" + programmingLanguage + "_" + difficulty;
    }
}
