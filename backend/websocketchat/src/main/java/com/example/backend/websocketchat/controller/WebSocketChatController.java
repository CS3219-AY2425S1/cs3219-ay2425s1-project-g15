package com.example.backend.websocketchat.controller;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.example.backend.websocketchat.WebSocketChatService;
import com.example.backend.websocketchat.config.ChatUserPrincipal;
import com.example.backend.websocketchat.kafka.producers.ChatlogProducer;
import com.example.backend.websocketchat.model.MessageConsumed;
import com.example.backend.websocketchat.model.MessageForwarded;

@Controller
public class WebSocketChatController {

    private WebSocketChatService webSocketChatService;
    private ChatlogProducer chatlogProducer;

    public WebSocketChatController(WebSocketChatService webSocketChatService, ChatlogProducer chatlogProducer) {
        this.webSocketChatService = webSocketChatService;
        this.chatlogProducer = chatlogProducer;
    }

    @MessageMapping("/ping")
    public void ping() {
        System.out.println("Ping received");
    }

    @MessageMapping("/sendMessage")
    public void processSentMessage(MessageConsumed message, Principal principal) {
        ChatUserPrincipal userPrincipal = (ChatUserPrincipal) principal;
        String senderId = userPrincipal.getName(); // This should return the wsid
        System.out.println("Sender ID: " + senderId + " sent message: " + message.toString());
        MessageForwarded forwardedMessage = createForwardedMessage(message, senderId);


        this.chatlogProducer.sendMessage("CHATLOGS", forwardedMessage);
        
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
        ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
        OffsetDateTime currDateTime = zonedDateTime.toOffsetDateTime().withNano(0);

        return new MessageForwarded(message.getMessage(), message.getCollabId(), senderId, message.getRecipientId(), currDateTime);
    }
}