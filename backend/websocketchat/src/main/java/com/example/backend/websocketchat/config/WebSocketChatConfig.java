package com.example.backend.websocketchat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketChatConfig implements WebSocketMessageBrokerConfigurer {
    private final String allowedOrigin = System.getenv("FRONTEND_CORS_ALLOWED_ORIGINS");
    // private final String allowedOrigin = "*";

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // HTTP URL for the WebSocket connection used by the client
        registry.addEndpoint("/chat-websocket")
                .setAllowedOriginPatterns("http://35.202.162.147:80") 
                .setHandshakeHandler(new UserHandshakeHandler())
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setApplicationDestinationPrefixes("/app");
        config.enableSimpleBroker("/topic", "/queue");
        config.setUserDestinationPrefix("/user");
    }

    // Intercepts messages coming from the client and handles connection and disconnection events
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (accessor != null) {
                    // Handle connection events
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        String connectedUser = accessor.getUser().getName(); 
                        System.out.println("User connected: " + connectedUser);
                    }
                    
                    // Handle disconnection events
                    if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                        String disconnectedUser = accessor.getUser().getName();
                        System.out.println("User disconnected: " + disconnectedUser);
                    }
                }
                
                return message;
            }
        });
    }
}
