package com.example.backend.matching.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // HTTP URL for the WebSocket connection used by the client
        registry.addEndpoint("/matching-websocket")
                .setHandshakeHandler(new UserHandshakeHandler())
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // routes to @MessageMapping methods in @Controller classes
        config.setApplicationDestinationPrefixes("/app");
        // defines message broker destinations: /topic for broadcasting to all subscribers, /queue for point-to-point messaging
        config.enableSimpleBroker("/topic", "/queue");
        // defines prefix for messages that are bound for a specific user
        config.setUserDestinationPrefix("/user");
    }
}