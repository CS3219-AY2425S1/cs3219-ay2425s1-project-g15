package com.example.backend.websocketchat.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.example.backend.websocketchat.WebSocketChatService;
import com.example.backend.websocketchat.config.ChatUserPrincipal;

import com.example.backend.websocketchat.model.Message;

@Controller
public class WebSocketChatController {

    private WebSocketChatService webSocketChatService;

    public WebSocketChatController(WebSocketChatService webSocketChatService) {
        this.webSocketChatService = webSocketChatService;
    }

    @MessageMapping("/sendMessage")
    public void processSentMessage(Message message, Principal principal) {
        ChatUserPrincipal myUserPrincipal = (ChatUserPrincipal) principal;
        String userID = myUserPrincipal.getName(); // This should return the wsid
        System.out.println("User ID: " + userID + " sent message: " + message.toString());


        this.webSocketChatService.sendToOtherUser("/queue/chat", message);
    }

    @MessageMapping("/sendLanguageChange")
    public void processLanguageChange(Message message, Principal principal) {
        ChatUserPrincipal myUserPrincipal = (ChatUserPrincipal) principal;
        String userID = myUserPrincipal.getName(); // This should return the wsid
        System.out.println("User ID: " + userID + " sent language change to: " + message.toString());

        this.webSocketChatService.sendToOtherUser("/queue/language", message);
    }
}