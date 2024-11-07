package com.example.backend.websocketchat.config;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.UriComponentsBuilder;


public class UserHandshakeHandler extends DefaultHandshakeHandler{
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        
                String query = request.getURI().getQuery();
                String userID = UriComponentsBuilder.fromUriString("?" + query)
                                              .build()
                                              .getQueryParams()
                                              .getFirst("userID");
                if (userID == null || userID.isEmpty()) {
                    throw new IllegalArgumentException("userID is required as a query parameter");
                }
        return new ChatUserPrincipal(userID);
    }
}
