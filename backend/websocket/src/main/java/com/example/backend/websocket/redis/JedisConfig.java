package com.example.backend.websocket.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Configuration
public class JedisConfig {
    private static final String REDIS_HOST = System.getenv("ENV").equals("DEV") ? System.getenv("DEV_REDIS_HOST") : System.getenv("PROD_REDIS_HOST");
    private static final int REDIS_PORT = System.getenv("ENV").equals("DEV") ? Integer.parseInt(System.getenv("DEV_REDIS_PORT")) : Integer.parseInt(System.getenv("PROD_REDIS_PORT"));

    @Bean
    public JedisPool jedisPool() {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(50);
        poolConfig.setMaxIdle(10);
        poolConfig.setMinIdle(5);
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        return new JedisPool(poolConfig, REDIS_HOST, REDIS_PORT);
    }
}