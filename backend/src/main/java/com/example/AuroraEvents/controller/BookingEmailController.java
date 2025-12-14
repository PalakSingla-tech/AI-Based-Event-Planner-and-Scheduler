package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Booking;
import com.example.AuroraEvents.repo.BookingRepo;
import com.example.AuroraEvents.scheduler.BookingEmailScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingEmailController {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private BookingEmailScheduler emailScheduler;

    /**
     * Manually trigger reminders for all upcoming bookings (within next 7 days)
     */
    @PostMapping("/send-reminders")
    public ResponseEntity<Map<String, Object>> sendAllReminders() {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(7);

        Date startDate = Date.valueOf(today);
        Date endDate = Date.valueOf(futureDate);

        List<Booking> upcomingBookings = bookingRepo.findUpcomingBookingsWithoutReminder(startDate, endDate);

        int successCount = 0;
        int failCount = 0;

        for (Booking booking : upcomingBookings) {
            try {
                emailScheduler.sendReminderForBooking(booking);
                successCount++;
            } catch (Exception e) {
                failCount++;
                System.err.println("Failed to send reminder for booking ID " + booking.getId());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Reminder emails sent");
        response.put("totalBookings", upcomingBookings.size());
        response.put("successCount", successCount);
        response.put("failCount", failCount);

        return ResponseEntity.ok(response);
    }

    /**
     * Send reminder for a specific booking by ID
     */
    @PostMapping("/{id}/send-reminder")
    public ResponseEntity<Map<String, String>> sendReminderById(@PathVariable int id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);

        if (bookingOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Booking not found");
            return ResponseEntity.notFound().build();
        }

        Booking booking = bookingOpt.get();

        try {
            emailScheduler.sendReminderForBooking(booking);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Reminder sent successfully");
            response.put("bookingId", String.valueOf(id));
            response.put("email", booking.getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send reminder: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Reset reminder status for a booking (for testing purposes)
     */
    @PutMapping("/{id}/reset-reminder")
    public ResponseEntity<Map<String, String>> resetReminderStatus(@PathVariable int id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);

        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = bookingOpt.get();
        booking.setReminderSent(false);
        bookingRepo.save(booking);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Reminder status reset successfully");
        response.put("bookingId", String.valueOf(id));

        return ResponseEntity.ok(response);
    }
}
