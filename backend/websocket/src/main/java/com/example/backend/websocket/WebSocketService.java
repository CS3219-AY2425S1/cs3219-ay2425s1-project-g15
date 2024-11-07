package com.example.backend.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry userRegistry;
    private final JedisPool jedisPool;
    private final String ACTIVE_USERS = "ActiveUsers";

    public WebSocketService(SimpMessagingTemplate messagingTemplate, SimpUserRegistry userRegistry, JedisPool jedisPool) {
        this.messagingTemplate = messagingTemplate;
        this.userRegistry = userRegistry;
        this.jedisPool = jedisPool;
    }

    // Notify user that a match has been found
    public void notifyUser(String userId, String message) {
        if (userRegistry.getUser(userId) != null) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/matches", message);
        } else {
            System.out.println("User " + userId + " is not connected.");
        }    
    }

    // Reject user from making a match request
    public void rejectUser(String userId, String message) {
        if (userRegistry.getUser(userId) != null) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/requestRejection", message);
        } else {
            System.out.println("User " + userId + " is not connected.");
        }    
    }

    public boolean isUserActive(String userEmail) {
        try (Jedis jedis = jedisPool.getResource()) {
            boolean isUserActive = jedis.sismember(ACTIVE_USERS, userEmail);
            jedis.close();
            return isUserActive;
        } catch (Exception e) {
            System.out.println("Error checking if user is active: " + e.getMessage());
            return false;
        }
    }

    public void addToActiveUsers(String userEmail) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.sadd(ACTIVE_USERS, userEmail);
            jedis.close();
        } catch (Exception e) {
            System.out.println("Error adding user to active users: " + e.getMessage());
        }
    }
}
