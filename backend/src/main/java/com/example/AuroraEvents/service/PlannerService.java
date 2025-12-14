package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.Planner;
import com.example.AuroraEvents.repo.PlannerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlannerService {

    @Autowired
    private PlannerRepo repo;

    public Planner addPlanner(Planner p) {
        return repo.save(p);
    }

    public List<Planner> getAll() {
        return repo.findAll();
    }

    public Planner updatePlanner(Planner p) {
        return repo.save(p);
    }

    public void deletePlanner(int id) {
        repo.deleteById(id);
    }

    public void updatePlannerRating(Integer plannerId, double averageRating, int totalRatings) {
        repo.findById(plannerId).ifPresent(planner -> {
            planner.setAverageRating(averageRating);
            planner.setTotalRatings(totalRatings);
            repo.save(planner);
        });
    }

}
