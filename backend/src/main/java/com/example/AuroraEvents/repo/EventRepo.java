package com.example.AuroraEvents.repo;

import com.example.AuroraEvents.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepo extends JpaRepository<Event, Integer> {
    List<Event> findByPlannerId(Integer plannerId);

}
