package com.example.backend.matchverification.kafka.consumers;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.example.backend.matchverification.controller.MatchVerificationHashsetService;

@Component
public class MatchVerificationConsumer {

    private final MatchVerificationHashsetService matchVerificationHashset;

    public MatchVerificationConsumer(MatchVerificationHashsetService matchVerificationHashsetService) {
        this.matchVerificationHashset = matchVerificationHashsetService;
    }

    @KafkaListener(topics = "DISCONNECTS")
    public void listen(String value) {
        System.out.println("Disconnect received: " + value);
        this.matchVerificationHashset.addToSeenRequests(value);
    }
}