package com.example.AuroraEvents.scheduler;

import com.example.AuroraEvents.model.Booking;
import com.example.AuroraEvents.repo.BookingRepo;
import com.example.AuroraEvents.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

// NOTE: Automated scheduling is DISABLED, but can be triggered manually via API
@Component
public class BookingEmailScheduler {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private EmailService emailService;

    @Value("${booking.reminder.days.advance:7}")
    private int daysInAdvance;

    /**
     * Scheduled task that runs daily at 9 AM to send booking reminders
     * Cron expression: 0 0 9 * * ? (second minute hour day month weekday)
     * NOTE: @Scheduled is DISABLED - automatic emails won't be sent
     * This method can still be triggered manually via BookingEmailController
     */
    // @Scheduled(cron = "${booking.reminder.cron:0 0 9 * * ?}")
    public void sendUpcomingBookingReminders() {
        System.out.println("Running scheduled task: Sending booking reminders...");

        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(daysInAdvance);

        Date startDate = Date.valueOf(today);
        Date endDate = Date.valueOf(futureDate);

        List<Booking> upcomingBookings = bookingRepo.findUpcomingBookingsWithoutReminder(startDate, endDate);

        System.out.println("Found " + upcomingBookings.size() + " upcoming bookings without reminders");

        for (Booking booking : upcomingBookings) {
            try {
                sendReminderForBooking(booking);
            } catch (Exception e) {
                System.err.println("Failed to send reminder for booking ID " + booking.getId() + ": " + e.getMessage());
            }
        }

        System.out.println("Completed sending booking reminders");
    }

    /**
     * Send reminder email for a specific booking and mark it as sent
     */
    public void sendReminderForBooking(Booking booking) {
        emailService.sendBookingReminder(
                booking.getEmail(),
                booking.getName(),
                booking.getEventName(),
                booking.getEventType(),
                booking.getEventDate().toString(),
                booking.getVenue());

        booking.setReminderSent(true);
        bookingRepo.save(booking);

        System.out.println("Sent reminder for booking ID: " + booking.getId() + " to " + booking.getEmail());
    }
}
