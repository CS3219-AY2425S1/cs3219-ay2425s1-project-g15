package com.example.backend.matchverification.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.Data;
import redis.clients.jedis.Jedis;

@Service
@Data
public class MatchVerificationHashsetService {
    @Autowired
    private final Jedis jedis;
    private final String SEEN_MATCH_REQUESTS = "SeenMatchRequests";

    public void addToSeenRequests(String matchRequest) {
        jedis.sadd(SEEN_MATCH_REQUESTS, matchRequest);
    }

    public boolean isSeen(String matchRequest) {
        return jedis.sismember(SEEN_MATCH_REQUESTS, matchRequest);
    }
}
