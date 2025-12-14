package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.Booking;
import com.example.AuroraEvents.model.PaymentHistory;
import com.example.AuroraEvents.repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepo repo;

    @Autowired
    private PaymentHistoryService paymentHistoryService;

    @Autowired
    private com.example.AuroraEvents.repo.EventRepo eventRepo;

    public Booking createBooking(String name, String email, String eventType, String eventName, java.sql.Date eventDate,
            String venue, Integer plannerId) {
        Booking b = new Booking();
        b.setName(name != null ? name.trim() : "");
        b.setEmail(email != null ? email.trim() : "");
        b.setEventType(eventType);
        b.setEventName(eventName);
        b.setEventDate(eventDate);
        b.setVenue(venue);
        b.setPlannerId(plannerId);
        b.setStatus("Pending");
        b.setPaymentStatus("PENDING");

        // Fetch price from planner's events (taking the first one as per current logic)
        List<com.example.AuroraEvents.model.Event> events = eventRepo.findByPlannerId(plannerId);
        if (!events.isEmpty()) {
            b.setTotalAmount(events.get(0).getPrice());
        } else {
            b.setTotalAmount(0.0);
        }

        b.setPaidAmount(0.0);
        return repo.save(b);
    }

    // USER BOOKINGS
    public List<Booking> getBookingsOfUser(String email) {
        return repo.findByEmail(email);
    }

    public Booking updateStatus(int id, String status) {
        Booking b = repo.findById(id).orElseThrow();

        switch (status.toUpperCase()) {
            case "CONFIRMED":
                b.setStatus("CONFIRMED");
                break;
            case "REJECTED":
                b.setStatus("REJECTED");
                break;
            case "COMPLETED":
                b.setStatus("COMPLETED");
                break;
            case "PENDING":
                b.setStatus("Pending");
                break;
            case "CANCELLED":
                b.setStatus("Cancelled");
                break;
            default:
                throw new RuntimeException("Invalid status: " + status);
        }

        return repo.save(b);
    }

    public List<Booking> getAllBookings() {
        return repo.findAll();
    }

    public Booking addBooking(Booking booking) {
        return repo.save(booking);
    }

    public Booking updateBooking(Booking booking) {
        return repo.save(booking);
    }

    public void deleteBooking(int id) {
        repo.deleteById(id);
    }

    public Booking markAsPaid(int bookingId, double amount, String paymentMethod, String transactionId) {
        Booking b = repo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        double newPaidAmount = (b.getPaidAmount() == null ? 0.0 : b.getPaidAmount()) + amount;
        b.setPaidAmount(newPaidAmount);

        if (b.getTotalAmount() != null && b.getTotalAmount() > 0) {
            if (newPaidAmount >= b.getTotalAmount()) {
                b.setPaymentStatus("PAID");
            } else {
                b.setPaymentStatus("PARTIALLY_PAID");
            }
        } else {
            // Fallback if total amount is not set
            b.setPaymentStatus("PAID");
        }

        repo.save(b);

        PaymentHistory ph = new PaymentHistory();
        ph.setBookingId(b.getId());
        ph.setUserEmail(b.getEmail());
        ph.setPlannerId(b.getPlannerId());
        ph.setAmount(amount);
        ph.setPaymentMethod(paymentMethod);
        ph.setTransactionId(transactionId);
        ph.setStatus("PAID");
        ph.setPaymentDate(LocalDateTime.now());

        paymentHistoryService.save(ph);

        return b;
    }
}
