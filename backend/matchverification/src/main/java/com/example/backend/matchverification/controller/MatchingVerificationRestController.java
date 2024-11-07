package com.example.backend.matchverification.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.backend.matchverification.kafka.producers.MatchVerificationProducer;
import com.example.backend.matchverification.model.PickQuestionDTO;
import com.example.backend.matchverification.model.PickedQuestionResponse;
import com.example.backend.matchverification.model.VerificationResponse;
import com.example.backend.matchverification.model.VerifyMatchesDTO;
import com.example.backend.matchverification.redis.MatchVerificationHashsetService;

@RestController
@RequestMapping("/api/matchverification")
public class MatchingVerificationRestController {

    private final MatchVerificationHashsetService invalidMatchesHashset;
    private MatchVerificationProducer matchVerificationProducer;

    private enum VerificationStatus {
        SUCCESS,
        CONFLICT_PARTIAL_INVALID,
        CONFLICT_BOTH_INVALID
    }

    private static final String QUESTION_API_URL = System.getenv("ENV").equals("DEV") ? System.getenv("DEV_QUESTION_API_URL") : System.getenv("PROD_QUESTION_API_URL");

    private final RestTemplate restTemplate = new RestTemplate();

    public MatchingVerificationRestController(MatchVerificationHashsetService matchRequestService, MatchVerificationProducer matchVerificationProducer) {
        this.invalidMatchesHashset = matchRequestService;
        this.matchVerificationProducer = matchVerificationProducer;
    }

    @GetMapping("")
    public String greeting() {
        return "Hello from matching verification service!";
    }

    @PostMapping("/verify")
    public VerificationResponse verify(@RequestBody VerifyMatchesDTO userMatches) {
        String matchReq1 = userMatches.getUser1();
        String matchReq2 = userMatches.getUser2();
        String userId1 = matchReq1.split("_")[0];
        String userEmail1 = matchReq1.split("_")[1];
        String userId2 = matchReq2.split("_")[0];
        String userEmail2 = matchReq2.split("_")[1];
        String matchCriteriaTopic = userMatches.getMatchCriteriaTopic();
        String matchCriteriaDifficulty = userMatches.getMatchCriteriaDifficulty();
        String matchCriteriaLanguage = userMatches.getMatchCriteriaLanguage();

        System.out.println("Verifying match requests: " + matchReq1 + " and " + matchReq2);

        boolean match1IsInvalid = invalidMatchesHashset.isSeen(userId1);
        boolean match2IsInvalid = invalidMatchesHashset.isSeen(userId2);
        System.out.println("Match1 status: " + !match1IsInvalid + " Match2 status: " + !match2IsInvalid);

        List<String> validMatches = new ArrayList<>();
        List<String> invalidMatches = new ArrayList<>();

        if (match1IsInvalid) {
            invalidMatches.add(matchReq1);
        } else {
            validMatches.add(matchReq1);
        }

        if (match2IsInvalid) {
            invalidMatches.add(matchReq2);
        } else {
            validMatches.add(matchReq2);
        }

        String status = VerificationStatus.SUCCESS.toString();
        String message;
        if (validMatches.size() == 1 && invalidMatches.size() == 1) {
            System.out.println("PARTIAL INVALID MATCH");
            message = "One or more of the match requests are invalid.";
            status = VerificationStatus.CONFLICT_PARTIAL_INVALID.toString();
        } else if (invalidMatches.size() == 2) {
            System.out.println("BOTH INVALID MATCH");
            message = "Both match requests are invalid.";
            status = VerificationStatus.CONFLICT_BOTH_INVALID.toString();
        } else {
            System.out.println("VALID MATCH");
            message = "Both match requests are new and valid.";
            invalidMatchesHashset.addToSeenRequests(userId1); // Add userId1
            invalidMatchesHashset.addToSeenRequests(userId2); // Add userId2

            int questionId = -1;

            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                PickQuestionDTO pickQuestionDTO = new PickQuestionDTO(matchCriteriaDifficulty, matchCriteriaTopic);
                HttpEntity<PickQuestionDTO> request = new HttpEntity<>(pickQuestionDTO, headers);
                
                ResponseEntity<PickedQuestionResponse> response = restTemplate.exchange(
                    QUESTION_API_URL + "/pick-question",
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<PickedQuestionResponse>() {}
                );

                if (!response.getStatusCode().is2xxSuccessful()) {
                    throw new RestClientException("Failed to pick a question for the match criteria. Status code: " + response.getStatusCode());
                }

                PickedQuestionResponse pickedQuestionResponse = response.getBody();
                if (pickedQuestionResponse == null) {
                    System.err.println("Failed to pick a question for the match criteria. Picked question response is missing.");
                }

                questionId = pickedQuestionResponse.getQuestionid();
            } catch (RestClientException e) {
                System.err.println("Error calling question service: " + e.getMessage());
            }  

            String collaborationUniqueId = UUID.randomUUID().toString();
            String successfulMatch = collaborationUniqueId 
                                    + "_" 
                                    + questionId 
                                    + "_" 
                                    + matchCriteriaLanguage
                                    + "_"
                                    + userId1 
                                    + "_" 
                                    + userEmail1 
                                    + "_" 
                                    + userId2 
                                    + "_" 
                                    + userEmail2;
            System.out.println("Successful match message: " + successfulMatch);
            matchVerificationProducer.sendMessage("SUCCESSFUL_MATCHES", successfulMatch, successfulMatch);
        }

        return new VerificationResponse(
            status,
            message,
            validMatches,
            invalidMatches
        );
    }
}
