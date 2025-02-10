package com.example.backend.websocket.model;

import java.util.List;

import lombok.Data;

@Data
public class VerifyMatchCriteriaDTO {
    List<String> complexity;
    List<String> category;

    public VerifyMatchCriteriaDTO(List<String> complexity, List<String> category) {
        this.complexity = complexity;
        this.category = category;
    }
}
