package com.example.backend.matchverification.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "matches")
@Data
public class Match {
    @Id
    private ObjectId id; 
    private String userEmail1;
    private String userEmail2;

    public Match() {}

    public Match(String userEmail1, String userEmail2) {
        this.userEmail1 = userEmail1;
        this.userEmail2 = userEmail2;
    }

    // Override toString method
    @Override
    public String toString() {
        return "Matches{" +
                "id='" + id + '\'' +
                ", userEmail1='" + userEmail1 + '\'' +
                ", userEmail2='" + userEmail2 + '\'' +
                '}';
    }
}
