package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Rating;
import com.example.AuroraEvents.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingService service;

    @PostMapping
    public ResponseEntity<?> addRating(@RequestBody Rating rating) {
        try {
            Rating saved = service.addRating(rating);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/planner/{plannerId}")
    public List<Rating> getRatingsByPlanner(@PathVariable Integer plannerId) {
        return service.getRatingsByPlanner(plannerId);
    }

    @GetMapping("/planner/{plannerId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Integer plannerId) {
        Double avg = service.getAverageRating(plannerId);
        List<Rating> ratings = service.getRatingsByPlanner(plannerId);

        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", avg);
        response.put("totalRatings", ratings.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userEmail}")
    public List<Rating> getRatingsByUser(@PathVariable String userEmail) {
        return service.getRatingsByUser(userEmail);
    }

    @GetMapping
    public List<Rating> getAllRatings() {
        return service.getAllRatings();
    }
}
