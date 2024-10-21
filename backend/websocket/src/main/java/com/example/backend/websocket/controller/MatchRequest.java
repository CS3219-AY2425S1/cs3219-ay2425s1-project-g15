package com.example.backend.websocket.controller;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class MatchRequest {
    private String userEmail;
    private String[] topics;
    private String[] programmingLanguages;
    private String[] difficulties;

    public List<String> getMatchCriteriaKey() {
        System.out.println("topics" + topics);
        System.out.println(programmingLanguages);
        System.out.println(difficulties);
        List<String> combinations = new ArrayList<>();
        for (String t : topics) {
            for (String pl : programmingLanguages) {
                for (String d : difficulties) {
                    combinations.add(t + "_" + pl + "_" + d);
                }
            }
        }
        return combinations;
    }
}
