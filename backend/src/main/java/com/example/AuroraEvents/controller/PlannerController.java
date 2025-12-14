package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Planner;
import com.example.AuroraEvents.service.PlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/planners")
public class PlannerController {
    @Autowired
    private PlannerService service;

    @PostMapping
    public Planner create(@RequestBody Planner p) {
        return service.addPlanner(p);
    }

    @GetMapping
    public List<Planner> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public Planner update(@PathVariable int id, @RequestBody Planner p) {
        p.setId(id);
        return service.updatePlanner(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.deletePlanner(id);
    }
}
