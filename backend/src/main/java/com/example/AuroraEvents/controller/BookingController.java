package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Booking;
import com.example.AuroraEvents.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // USER - create booking
    @PostMapping("/booking")
    public Booking bookPlanner(@RequestParam String name,
                               @RequestParam String email,
                               @RequestParam String eventType,
                               @RequestParam String eventName,
                               @RequestParam Date eventDate,
                               @RequestParam String venue,
                               @RequestParam Integer plannerId) {

        Booking booking = bookingService.createBooking(
                name, email, eventType, eventName, eventDate, venue, plannerId
        );

        return booking;
    }

    // USER - get their own bookings
    @GetMapping("/mybookings/{email}")
    public List<Booking> getAllBookings(@PathVariable String email) {
        return bookingService.getBookingsOfUser(email);
    }

    // ⭐ ADMIN - get ALL bookings (THIS WAS MISSING)
    @GetMapping("/bookings")
    public List<Booking> getAllBookingsForAdmin() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/bookings/{id}/status")
    public Booking updateBookingStatus(@PathVariable int id, @RequestParam String status) {
        return bookingService.updateStatus(id, status);
    }

    // Payment update
    @PutMapping("/booking/payment/{id}")
    public Booking markPaid(@PathVariable int id,
                            @RequestParam double amount,
                            @RequestParam(required = false) String method,
                            @RequestParam(required = false) String txId) {

        return bookingService.markAsPaid(
                id,
                amount,
                (method == null ? "CARD" : method),
                (txId == null ? "txn_" + System.currentTimeMillis() : txId)
        );
    }
}
