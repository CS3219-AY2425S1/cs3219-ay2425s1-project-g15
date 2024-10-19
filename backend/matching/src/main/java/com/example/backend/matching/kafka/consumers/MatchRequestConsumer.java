package com.example.backend.matching.kafka.consumers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.backend.matching.kafka.producers.MatchVerificationProducer;
import com.example.backend.matching.model.VerificationResponse;

@Component
public class MatchRequestConsumer {

    private enum VerificationStatus {
        SUCCESS,
        CONFLICT_PARTIAL_INVALID,
        CONFLICT_BOTH_INVALID
    }

    private final Map<String, String> waitingRequests = new HashMap<>();

    private final MatchVerificationProducer matchVerificationProducer;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String VERIFY_API_URL = "http://matchverification:3006/api/verify"; // TODO: Put in .env

    @Autowired
    public MatchRequestConsumer(MatchVerificationProducer matchVerificationProducer) {
        this.matchVerificationProducer = matchVerificationProducer;
    }

    @KafkaListener(topics = "MATCH_REQUESTS", groupId = "matching-service")
    public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key, String value) {
        System.out.println("Received message, key: " + key + " value: " + value);

        if (waitingRequests.containsKey(key)) {
            // Match found
            String otherUserValue = waitingRequests.remove(key);

            System.out.println("Match found for key: " + key);
            System.out.println("Matching users: " + value + " and " + otherUserValue);
            System.out.println("Verifying match requests...");

            List<String> matchRequests = new ArrayList<>();
            matchRequests.add(value);
            matchRequests.add(otherUserValue);

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<List<String>> request = new HttpEntity<>(matchRequests, headers);
                ResponseEntity<VerificationResponse> response = restTemplate.exchange(
                    VERIFY_API_URL,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<VerificationResponse>() {}
                );

                if (!response.getStatusCode().is2xxSuccessful()) {
                    throw new RestClientException("Failed to verify match requests. Status code: " + response.getStatusCode());
                }

                VerificationResponse verificationResponse = response.getBody();
                if (verificationResponse == null) {
                    System.err.println("Failed to verify match requests. Verification response is missing.");
                }
                
                String vStatus = verificationResponse.getStatus();

                System.out.println("Verification Status: " + vStatus);
                System.out.println("Message: " + verificationResponse.getMessage());
                System.out.println("Valid Matches: " + verificationResponse.getValidMatches());
                System.out.println("Invalid Matches: " + verificationResponse.getInvalidMatches());


                if (vStatus.equals(VerificationStatus.SUCCESS.toString())) {
                    System.out.println("Match verified successfully. Sending to Kafka topic.");
                    List<String> validMatches = verificationResponse.getValidMatches();
                    List<String> invalidMatches = verificationResponse.getInvalidMatches();

                    if (validMatches.size() == 2 && invalidMatches.isEmpty() && vStatus.equals(VerificationStatus.SUCCESS.toString())) {
                        System.out.println(validMatches);
                        String payload = validMatches.get(0) + "_" + validMatches.get(1);

                        for (String match : validMatches) {
                            System.out.println(match);
                            String userID = match.split("_")[0];
                            matchVerificationProducer.sendMessage("SUCCESSFUL_MATCHES", userID, payload);
                        }
                    }
                } else if (vStatus.equals(VerificationStatus.CONFLICT_PARTIAL_INVALID.toString())) {
                    System.out.println("Partial match verification failed. Not sending to Kafka topic.");
                    assert verificationResponse.getInvalidMatches().size() == 1; // Defensive check
                    String unseenMatch = verificationResponse.getValidMatches().get(0);
                    waitingRequests.put(key, unseenMatch);
                } else if (vStatus.equals(VerificationStatus.CONFLICT_BOTH_INVALID.toString())) {
                    System.out.println("Both matches are invalid. Not sending to Kafka topic.");
                    assert verificationResponse.getInvalidMatches().isEmpty(); // Defensive check
                } else {
                    if (verificationResponse.getMessage() != null) {
                        System.err.println("Verification failed: " + verificationResponse.getMessage());
                }
                    System.out.println("Match verification failed. Not sending to Kafka topic.");
                }


            } catch (RestClientException e) {
                System.err.println("Error calling verification service: " + e.getMessage());
            }
            
        } else {
            System.out.println("No match found for key: " + key);
            waitingRequests.put(key, value);
        }
    }
}
