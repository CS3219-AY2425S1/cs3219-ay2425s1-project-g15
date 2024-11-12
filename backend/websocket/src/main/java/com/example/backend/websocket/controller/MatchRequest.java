package com.example.backend.websocket.controller;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.backend.websocket.model.VerifyMatchCriteriaDTO;
import com.example.backend.websocket.model.VerificationResponse;

@Data
public class MatchRequest {
    private String userEmail;
    private String[] topics;
    private String[] programmingLanguages;
    private String[] difficulties;

    private static final String QUESTION_API_URL = System.getenv("ENV").equals("DEV") ? System.getenv("DEV_QUESTION_API_URL") : System.getenv("PROD_QUESTION_API_URL");

    private final RestTemplate restTemplate = new RestTemplate();

    // Retrieves all match criteria combinations for which at least 1 question exists
    public List<String> getValidMatchCriteriaKey() {
        List<String> validMatchCriteriaKey = new ArrayList<>();

        List<String> allTopicsInCombinations = new ArrayList<>();
        List<String> allDifficutiesInCombinations = new ArrayList<>();
        List<String> allProgrammingLanguagesInCombinations = new ArrayList<>();
        for (String t : topics) {
            for (String d : difficulties) {
                for (String pl : programmingLanguages) {
                    allTopicsInCombinations.add(t);
                    allDifficutiesInCombinations.add(d);
                    allProgrammingLanguagesInCombinations.add(pl);
                }
            }
        }
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            VerifyMatchCriteriaDTO verifyMatchCriteriaDTO = new VerifyMatchCriteriaDTO(allDifficutiesInCombinations, allTopicsInCombinations);
            HttpEntity<VerifyMatchCriteriaDTO> request = new HttpEntity<>(verifyMatchCriteriaDTO, headers);
            
            ResponseEntity<VerificationResponse> response = restTemplate.exchange(
                QUESTION_API_URL + "/count-question",
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<VerificationResponse>() {}
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RestClientException("Failed to verify that a question exists for the match criteria. Status code: " + response.getStatusCode());
            }

            VerificationResponse verificationResponse = response.getBody();
            if (verificationResponse == null) {
                System.err.println("Failed to verify that a question exists for the match criteria. Verification response is missing.");
            }

            int[] questionCounts = verificationResponse.getCounts();
            for (int i = 0; i < questionCounts.length; i++) {
                String matchCriteria = allTopicsInCombinations.get(i) 
                                        + "_" 
                                        + allProgrammingLanguagesInCombinations.get(i) 
                                        + "_" 
                                        + allDifficutiesInCombinations.get(i);
                if (questionCounts[i] > 0) {
                    validMatchCriteriaKey.add(matchCriteria);
                    System.out.println("At least 1 question found for match criteria: " + matchCriteria);
                } else {
                    System.out.println("No question found for match criteria: " + matchCriteria);
                }
            }
            System.out.println("Valid match criteria (at least 1 question exists): " + validMatchCriteriaKey);
        } catch (RestClientException e) {
            System.err.println("Error calling question service: " + e.getMessage());
        }

        return validMatchCriteriaKey;
    }
}
