package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.Event;
import com.example.AuroraEvents.repo.EventRepo;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepo repo;

    public Event addEvent(Event event) {
        return repo.save(event);
    }

    public List<Event> getAllEvents() {
        return repo.findAll();
    }

    public Event updateEvent(Event updatedEvent) {
        return repo.save(updatedEvent);
    }

    public void deleteEvent(int id) {
        repo.deleteById(id);
    }

    public List<Event> getEventsByPlanner(Integer plannerId) {
        return repo.findByPlannerId(plannerId);
    }

}
