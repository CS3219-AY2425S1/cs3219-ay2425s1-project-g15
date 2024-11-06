package com.example.backend.websocket.config;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.backend.websocket.kafka.producers.DisconnectProducer;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private DisconnectProducer disconnectProducer;

    @Autowired
    private JedisPool jedisPool;

    // private final String allowedOrigin = System.getenv("FRONTEND_CORS_ALLOWED_ORIGINS");
    //private final String allowedOrigin = "http://localhost:3000";
    private final String allowedOrigin = "http://35.202.162.147:80";

    private final String ACTIVE_USERS = "ActiveUsers";

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // HTTP URL for the WebSocket connection used by the client
        registry.addEndpoint("/matching-websocket")
                .setAllowedOriginPatterns(allowedOrigin)
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
                        MyUserPrincipal principal = (MyUserPrincipal) accessor.getUser();
                        String disconnectedUserEmail = principal.getUserEmail(); 
                        if (disconnectedUserEmail.equals("")) {
                            // This is the disconnection event for the same user's second connection
                            System.out.println("Disconnection event for active user's subsequent connection");
                            return message;
                        }

                        try {
                            Jedis jedis = jedisPool.getResource();
                            jedis.srem(ACTIVE_USERS, disconnectedUserEmail);
                            jedis.close();
                        } catch (Exception e) {
                            System.out.println("Error removing user from ActiveUsers: " + e.getMessage());
                        }
            
                        String disconnectedUserWsid = principal.getName();
                        System.out.println("User disconnected: " + disconnectedUserWsid);
                        disconnectProducer.sendMessage("DISCONNECTS", disconnectedUserWsid, disconnectedUserWsid); 
                    }
                }
                
                return message;
            }
        });
    }
}
