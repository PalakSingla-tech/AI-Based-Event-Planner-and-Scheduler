package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Event;
import com.example.AuroraEvents.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // CREATE event (JSON BODY)
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.addEvent(event);
    }

    // READ all
    @GetMapping
    public List<Event> getEvents() {
        return eventService.getAllEvents();
    }

    // UPDATE event (JSON BODY)
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable int id, @RequestBody Event event) {
        event.setId(id);
        return eventService.updateEvent(event);
    }

    // DELETE event
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable int id) {
        eventService.deleteEvent(id);
    }

    @GetMapping("/byPlanner/{plannerId}")
    public List<Event> getEventsByPlanner(@PathVariable Integer plannerId) {
        return eventService.getEventsByPlanner(plannerId);
    }
}
