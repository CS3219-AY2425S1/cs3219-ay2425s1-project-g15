package com.example.backend.matching.kafka;

import java.util.HashMap;
import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.example.backend.matching.websocket.WebSocketService;

@Component
public class MatchRequestConsumer {

    private final Map<String, String> waitingRequests = new HashMap<>();
    private final WebSocketService webSocketService;

    public MatchRequestConsumer(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @KafkaListener(topics = "MATCH_REQUESTS", groupId = "matching-service")
    public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key, String value) {
        System.out.println("Received message, key: " + key + " value: " + value);

        if (waitingRequests.containsKey(key)) {
            // Match found
            System.out.println("Match found for key: " + key);
            String otherUserValue = waitingRequests.remove(key);
            handleMatch(value, otherUserValue);
        } else {
            // No match found, add to waiting list
            System.out.println("No match found for key: " + key);
            waitingRequests.put(key, value);
        }
    }

    private void handleMatch(String user1, String user2) {
        System.out.println("Notifying users about match");
        String user1Id = user1.split("_")[0];
        String user1Email = user1.split("_")[1];
        String user2Id = user1.split("_")[0];
        String user2Email = user1.split("_")[1];
        webSocketService.notifyUser(user1Id, "Matched with: " + user2Email);
        webSocketService.notifyUser(user2Id, "Matched with: " + user1Email);
    }
}
