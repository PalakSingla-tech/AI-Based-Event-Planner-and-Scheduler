package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.Rating;
import com.example.AuroraEvents.repo.RatingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired
    private RatingRepo repo;

    @Autowired
    private PlannerService plannerService;

    public Rating addRating(Rating rating) {
        // Check if user already rated this planner
        Optional<Rating> existing = repo.findByPlannerIdAndUserEmail(rating.getPlannerId(), rating.getUserEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("You have already rated this planner");
        }

        Rating saved = repo.save(rating);

        // Update planner's average rating
        updatePlannerRating(rating.getPlannerId());

        return saved;
    }

    public List<Rating> getRatingsByPlanner(Integer plannerId) {
        return repo.findByPlannerId(plannerId);
    }

    public List<Rating> getRatingsByUser(String userEmail) {
        return repo.findByUserEmail(userEmail);
    }

    public Double getAverageRating(Integer plannerId) {
        List<Rating> ratings = repo.findByPlannerId(plannerId);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        double sum = ratings.stream().mapToInt(Rating::getRating).sum();
        return sum / ratings.size();
    }

    public void updatePlannerRating(Integer plannerId) {
        List<Rating> ratings = repo.findByPlannerId(plannerId);
        if (!ratings.isEmpty()) {
            double avg = ratings.stream().mapToInt(Rating::getRating).average().orElse(0.0);
            // Round to 1 decimal place
            avg = Math.round(avg * 10.0) / 10.0;
            plannerService.updatePlannerRating(plannerId, avg, ratings.size());
        }
    }

    public List<Rating> getAllRatings() {
        return repo.findAll();
    }
}
