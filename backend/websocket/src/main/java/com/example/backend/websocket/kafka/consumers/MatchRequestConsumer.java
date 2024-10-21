package com.example.backend.websocket.kafka.consumers;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.example.backend.websocket.WebSocketService;
import com.example.backend.websocket.model.MatchNotification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MatchRequestConsumer {
    private final WebSocketService webSocketService;
    private final ObjectMapper objectMapper;

    public MatchRequestConsumer(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
        this.objectMapper = new ObjectMapper(); 
    }

    @KafkaListener(topics = "SUCCESSFUL_MATCHES")
    public void listen(String value) {
        System.out.println("Received successful match: " + value);
        
        String[] userInformation = value.split("_");
        String user1Id = userInformation[0];
        String user1Email = userInformation[1];
        String user2Id = userInformation[2];
        String user2Email = userInformation[3];
    
        MatchNotification user1Notification = new MatchNotification(user2Email);
        MatchNotification user2Notification = new MatchNotification(user1Email);

        try {
            String jsonNotification1 = objectMapper.writeValueAsString(user1Notification);
            String jsonNotification2 = objectMapper.writeValueAsString(user2Notification);
            webSocketService.notifyUser(user1Id, jsonNotification1);
            webSocketService.notifyUser(user2Id, jsonNotification2);
        } catch (JsonProcessingException e) {
            System.err.println("Error converting notification to JSON: " + e.getMessage());
        }
    }
}
