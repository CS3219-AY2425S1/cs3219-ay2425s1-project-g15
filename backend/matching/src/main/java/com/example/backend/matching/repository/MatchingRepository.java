package com.example.backend.matching.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.matching.model.MatchingModel;

public interface MatchingRepository extends MongoRepository<MatchingModel, Long> {
    
    
}