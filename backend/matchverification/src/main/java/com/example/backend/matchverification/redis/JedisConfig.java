package com.example.backend.matchverification.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.Jedis;

@Configuration
public class JedisConfig {
    private static final String REDIS_HOST = System.getenv("ENV").equals("DEV") ? System.getenv("DEV_REDIS_HOST") : System.getenv("PROD_REDIS_HOST");
    private static final int REDIS_PORT = System.getenv("ENV").equals("DEV") ? Integer.parseInt(System.getenv("DEV_REDIS_PORT")) : Integer.parseInt(System.getenv("PROD_REDIS_PORT"));

    @Bean
    public Jedis jedis() {
        return new Jedis(REDIS_HOST, REDIS_PORT);
    }
}