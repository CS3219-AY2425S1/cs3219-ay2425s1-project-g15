package com.example.backend.websocketchat;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import com.example.backend.websocketchat.config.ChatUserPrincipal;
import com.example.backend.websocketchat.model.Message;

@Service
public class WebSocketChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;

    public WebSocketChatService(SimpMessagingTemplate messagingTemplate, SimpUserRegistry userRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.userRegistry = userRegistry;
    }

    public void sendToOtherUser(String topic, Message message) {
        String targetID = message.getTargetID();
        boolean targetUserConnected = userRegistry.getUsers().stream()
                .map(SimpUser::getName)
                .anyMatch(userID -> userID.equals(targetID));

        if (targetUserConnected) {
            System.out.println("Sending message " + message.toString() + " to " + targetID);
            System.out.println("Topic is " + topic);
            messagingTemplate.convertAndSendToUser(targetID, topic, message.getMessage());
        } else {
            System.out.println("User " + targetID + " is not connected.");
        }
    }
}
