package com.example.backend.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import com.example.backend.websocket.config.MyUserPrincipal;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;

    public WebSocketService(SimpMessagingTemplate messagingTemplate, SimpUserRegistry userRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.userRegistry = userRegistry;
    }

    // Notify user that a match has been found
    public void notifyUser(String userId, String message) {
        if (userRegistry.getUser(userId) != null) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/matches", message);
        } else {
            System.out.println("User " + userId + " is not connected.");
        }    
    }

    // Reject user from making a match request
    public void rejectUser(String userId, String message) {
        if (userRegistry.getUser(userId) != null) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/requestRejection", message);
        } else {
            System.out.println("User " + userId + " is not connected.");
        }    
    }

    public boolean isUserEmailActive(String userEmail) {
        return userRegistry.getUsers().stream()
                .map(user -> (MyUserPrincipal) user.getPrincipal())
                .anyMatch(principal -> principal.getUserEmail().equals(userEmail));
    }
}
