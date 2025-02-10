package com.example.backend.websocketchat.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.UriComponentsBuilder;


public class UserHandshakeHandler extends DefaultHandshakeHandler{
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        
                String query = request.getURI().getQuery();
                String senderId = UriComponentsBuilder.fromUriString("?" + query)
                                              .build()
                                              .getQueryParams()
                                              .getFirst("senderId");
                if (senderId == null || senderId.isEmpty()) {
                    throw new IllegalArgumentException("senderId is required as a query parameter");
                }
        return new ChatUserPrincipal(senderId);
    }
}
