package com.example.backend.matching.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/matching")
public class MatchingRestController {

    @GetMapping("")
    public String greeting() {
        System.out.println("Sending Greetings!");
        return "Hello from matching service!";
    }

}
