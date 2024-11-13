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
        String collaborationId = userInformation[0];
        String questionId = userInformation[1];
        String language = userInformation[2];
        String user1WsId = userInformation[3];
        String user1Id = userInformation[4];
        String user1Email = userInformation[5];
        String user2WsId = userInformation[6];
        String user2Id = userInformation[7];
        String user2Email = userInformation[8];
    
        MatchNotification user1Notification = new MatchNotification(user2Email, user2Id, collaborationId, questionId, language);
        MatchNotification user2Notification = new MatchNotification(user1Email, user1Id, collaborationId, questionId, language);

        try {
            String jsonNotification1 = objectMapper.writeValueAsString(user1Notification);
            String jsonNotification2 = objectMapper.writeValueAsString(user2Notification);
            webSocketService.notifyUser(user1WsId, jsonNotification1);
            webSocketService.notifyUser(user2WsId, jsonNotification2);
        } catch (JsonProcessingException e) {
            System.err.println("Error converting notification to JSON: " + e.getMessage());
        }
    }
}
