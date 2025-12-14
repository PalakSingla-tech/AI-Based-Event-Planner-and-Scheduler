package com.example.AuroraEvents.repo;

import com.example.AuroraEvents.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Integer> {
    List<Rating> findByPlannerId(Integer plannerId);

    List<Rating> findByUserEmail(String userEmail);

    Optional<Rating> findByPlannerIdAndUserEmail(Integer plannerId, String userEmail);
}
