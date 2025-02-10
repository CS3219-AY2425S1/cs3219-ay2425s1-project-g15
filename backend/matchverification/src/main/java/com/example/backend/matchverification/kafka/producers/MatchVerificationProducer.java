package com.example.backend.matchverification.kafka.producers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class MatchVerificationProducer {
    @Autowired
    private final KafkaTemplate<String, String> kafkaTemplate;

    public MatchVerificationProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, String key, String value) {
        kafkaTemplate.send(topic, key, value);
    }
}
