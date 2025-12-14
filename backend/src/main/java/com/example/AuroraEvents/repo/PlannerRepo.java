package com.example.AuroraEvents.repo;

import com.example.AuroraEvents.model.Planner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlannerRepo extends JpaRepository<Planner, Integer> {
}
