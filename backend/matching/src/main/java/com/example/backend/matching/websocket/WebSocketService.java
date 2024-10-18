package com.example.backend.matching.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyUser(String userId, String message) {
        System.out.println("Sending message to user: " + userId + "Message: " + message);
        messagingTemplate.convertAndSendToUser(userId, "/queue/matches", message);
    }
}
