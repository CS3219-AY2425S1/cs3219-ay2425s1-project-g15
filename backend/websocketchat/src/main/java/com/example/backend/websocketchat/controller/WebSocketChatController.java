package com.example.backend.websocketchat.controller;

import java.security.Principal;
import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.example.backend.websocketchat.WebSocketChatService;
import com.example.backend.websocketchat.config.ChatUserPrincipal;
import com.example.backend.websocketchat.model.MessageConsumed;
import com.example.backend.websocketchat.model.MessageForwarded;

@Controller
public class WebSocketChatController {

    private WebSocketChatService webSocketChatService;

    public WebSocketChatController(WebSocketChatService webSocketChatService) {
        this.webSocketChatService = webSocketChatService;
    }

    @MessageMapping("/sendMessage")
    public void processSentMessage(MessageConsumed message, Principal principal) {
        ChatUserPrincipal userPrincipal = (ChatUserPrincipal) principal;
        String senderId = userPrincipal.getName(); // This should return the wsid
        System.out.println("Sender ID: " + senderId + " sent message: " + message.toString());
        MessageForwarded forwardedMessage = createForwardedMessage(message, senderId);
        
        this.webSocketChatService.sendToCurrentUser("/queue/chat", forwardedMessage);
        this.webSocketChatService.sendToOtherUser("/queue/chat", forwardedMessage);
    }

    @MessageMapping("/sendLanguageChange")
    public void processLanguageChange(MessageConsumed message, Principal principal) {
        ChatUserPrincipal myUserPrincipal = (ChatUserPrincipal) principal;
        String senderId = myUserPrincipal.getName(); // This should return the wsid
        System.out.println("Sender ID: " + senderId + " sent language change to: " + message.toString());

        MessageForwarded messageForwarded = createForwardedMessage(message, senderId);

        this.webSocketChatService.sendToOtherUser("/queue/language", messageForwarded);
    }

    private MessageForwarded createForwardedMessage(MessageConsumed message, String senderId) {
        LocalDateTime currDateTime = LocalDateTime.now();

        return new MessageForwarded(message.getMessage(), message.getCollabId(), senderId, message.getRecipientId(), currDateTime);
    }
}