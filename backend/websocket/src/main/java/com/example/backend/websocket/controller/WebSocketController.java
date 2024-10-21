package com.example.backend.websocket.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.example.backend.websocket.WebSocketService;
import com.example.backend.websocket.config.MyUserPrincipal;
import com.example.backend.websocket.kafka.producers.MatchRequestProducer;

@Controller
public class WebSocketController {

    private MatchRequestProducer matchRequestProducer;
    private WebSocketService webSocketService;

    public WebSocketController(MatchRequestProducer matchRequestProducer, WebSocketService webSocketService) {
        this.matchRequestProducer = matchRequestProducer;
        this.webSocketService = webSocketService;
    }

    @MessageMapping("/matchRequest")
    public void processMatchRequest(MatchRequest matchRequest, Principal principal) {
        MyUserPrincipal myUserPrincipal = (MyUserPrincipal) principal;
        String userId = myUserPrincipal.getName(); // This should return the wsid
        System.out.println("Received match request from user: " + matchRequest.getUserEmail());
        
        if (webSocketService.isUserEmailActive(matchRequest.getUserEmail())) {
            System.out.println("User " + matchRequest.getUserEmail() + " is already active.");
            webSocketService.rejectUser(userId, "You are already active on another device.");
            return;
        }

        myUserPrincipal.setUserEmail(matchRequest.getUserEmail());
        matchRequest.getMatchCriteriaKey().forEach(key -> {
            matchRequestProducer.sendMessage("MATCH_REQUESTS", key, userId + "_" + matchRequest.getUserEmail());
        });
    }
}