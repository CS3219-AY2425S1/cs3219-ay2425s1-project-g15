package com.example.backend.matching.model;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class MatchingModel {
    @Id
    private Long id;
    private String userEmail1;
    private String userEmail2;
    // private Map<String, String> criteria; // TBD
}