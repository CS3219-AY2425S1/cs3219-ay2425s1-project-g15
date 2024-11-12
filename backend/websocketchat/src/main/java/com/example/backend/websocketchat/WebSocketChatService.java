package com.example.backend.websocketchat;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import com.example.backend.websocketchat.model.MessageForwarded;

@Service
public class WebSocketChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;

    public WebSocketChatService(SimpMessagingTemplate messagingTemplate, SimpUserRegistry userRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.userRegistry = userRegistry;
    }

    public void sendToCurrentUser(String topic, MessageForwarded message) {
        String senderId = message.getSenderId();
        System.out.println("Sending message " + message.toString() + " to sender" + senderId);
        messagingTemplate.convertAndSendToUser(senderId, topic, message);
    }

    public void sendToOtherUser(String topic, MessageForwarded message) {
        String recipientId = message.getRecipientId();
        boolean targetUserConnected = userRegistry.getUsers().stream()
                .map(SimpUser::getName)
                .anyMatch(senderId -> senderId.equals(recipientId));

        if (targetUserConnected) {
            System.out.println("Sending message " + message.toString() + " to " + recipientId);
            System.out.println("Topic is " + topic);
            messagingTemplate.convertAndSendToUser(recipientId, topic, message);
        } else {
            System.out.println("User " + recipientId + " is not connected.");
        }
    }
}
