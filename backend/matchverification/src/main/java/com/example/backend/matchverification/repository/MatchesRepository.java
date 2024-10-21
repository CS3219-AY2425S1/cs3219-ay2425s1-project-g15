package com.example.backend.matchverification.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.matchverification.model.Match;

public interface MatchesRepository extends MongoRepository<Match, ObjectId> {
    
}