package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Booking;
import com.example.AuroraEvents.service.AIService;
import com.example.AuroraEvents.service.BookingService;
import com.example.AuroraEvents.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AIService aiService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getAnalyticsOverview() {
        List<Booking> bookings = bookingService.getAllBookings();

        long totalBookings = bookings.size();
        long completedBookings = bookings.stream().filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus())).count();
        long pendingBookings = bookings.stream().filter(b -> "Pending".equalsIgnoreCase(b.getStatus())).count();
        double totalRevenue = bookings.stream()
                .filter(b -> b.getPaidAmount() != null)
                .mapToDouble(Booking::getPaidAmount)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", totalBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("pendingBookings", pendingBookings);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/remind/{bookingId}")
    public ResponseEntity<String> sendReminder(@PathVariable int bookingId) {
        Booking booking = bookingService.getAllBookings().stream()
                .filter(b -> b.getId() == bookingId)
                .findFirst()
                .orElse(null);

        if (booking != null) {
            emailService.sendBookingReminder(
                    booking.getEmail(),
                    booking.getName(),
                    booking.getEventName(),
                    booking.getEventType(),
                    booking.getEventDate().toString(),
                    booking.getVenue());
            return ResponseEntity.ok("Reminder sent to " + booking.getEmail());
        }
        return ResponseEntity.badRequest().body("Booking not found");
    }

    @PostMapping("/send-to-planner/{bookingId}")
    public ResponseEntity<String> sendToPlanner(@PathVariable int bookingId, @RequestBody Map<String, String> payload) {
        Booking booking = bookingService.getAllBookings().stream()
                .filter(b -> b.getId() == bookingId)
                .findFirst()
                .orElse(null);

        if (booking != null) {
            String plannerEmail = payload.get("plannerEmail");
            if (plannerEmail == null || plannerEmail.isEmpty()) {
                // In a real app, we might fetch planner email from PlannerService using
                // booking.getPlannerId()
                // For now, we accept it from payload or default to a dummy
                plannerEmail = "planner@example.com";
            }

            String details = String.format("Event: %s\nDate: %s\nVenue: %s\nClient: %s (%s)",
                    booking.getEventName(), booking.getEventDate(), booking.getVenue(), booking.getName(),
                    booking.getEmail());

            emailService.sendBookingDetailsToPlanner(plannerEmail, details);
            return ResponseEntity.ok("Details sent to planner at " + plannerEmail);
        }
        return ResponseEntity.badRequest().body("Booking not found");
    }

    @PostMapping("/generate-description")
    public ResponseEntity<String> generateDescription(@RequestBody Map<String, String> payload) {
        String eventDetails = payload.get("eventDetails");
        String description = aiService.generateEventDescription(eventDetails);
        return ResponseEntity.ok(description);
    }
}
