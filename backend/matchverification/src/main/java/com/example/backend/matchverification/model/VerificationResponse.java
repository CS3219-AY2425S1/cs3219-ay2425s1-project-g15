package com.example.backend.matchverification.model;

import java.util.List;
import lombok.Data;

@Data
public class VerificationResponse {
    private String status;
    private String message;
    private List<String> validMatches;
    private List<String> invalidMatches;

    public VerificationResponse(String status, String message, List<String> validMatches, List<String> invalidMatches) {
        this.status = status;
        this.message = message;
        this.validMatches = validMatches;
        this.invalidMatches = invalidMatches;
    }
}
