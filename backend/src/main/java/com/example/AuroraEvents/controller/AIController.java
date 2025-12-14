package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<String> getRecommendations(@RequestBody Map<String, String> request) {
        String criteria = request.get("criteria");
        if (criteria == null || criteria.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Criteria cannot be empty.");
        }
        String response = aiService.getRecommendations(criteria);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/predict-budget")
    public ResponseEntity<String> predictBudget(@RequestBody Map<String, String> eventDetails) {
        String response = aiService.predictBudget(eventDetails);
        return ResponseEntity.ok(response);
    }
}
