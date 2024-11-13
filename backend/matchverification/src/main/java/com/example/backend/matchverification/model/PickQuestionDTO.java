package com.example.backend.matchverification.model;

import lombok.Data;

@Data
public class PickQuestionDTO {
    String complexity;
    String category;

    public PickQuestionDTO(String complexity, String category) {
        this.complexity = complexity;
        this.category = category;
    }
}
