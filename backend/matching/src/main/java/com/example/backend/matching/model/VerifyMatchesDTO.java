package com.example.backend.matching.model;

import lombok.Data;

@Data
public class VerifyMatchesDTO {
    String user1;
    String user2;
    String matchCriteriaTopic;
    String matchCriteriaDifficulty;
    String matchCriteriaLanguage;

    public VerifyMatchesDTO(String user1, String user2,  String matchCriteriaTopic, String matchCriteriaDifficulty, String matchCriteriaLanguage) {
        this.user1 = user1;
        this.user2 = user2;
        this.matchCriteriaTopic = matchCriteriaTopic;
        this.matchCriteriaDifficulty = matchCriteriaDifficulty;
        this.matchCriteriaLanguage = matchCriteriaLanguage;
    }
}