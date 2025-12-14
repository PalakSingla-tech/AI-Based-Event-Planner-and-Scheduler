package com.example.AuroraEvents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        if (emailSender == null) {
            System.out.println("\n========================================");
            System.out.println("⚠️  EMAIL NOT SENT - SMTP NOT CONFIGURED");
            System.out.println("========================================");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + text);
            System.out.println("========================================\n");
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@auroraevents.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            System.out.println("\n========================================");
            System.out.println("✅ EMAIL SENT SUCCESSFULLY");
            System.out.println("========================================");
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("========================================\n");
        } catch (Exception e) {
            System.err.println("\n========================================");
            System.err.println("❌ FAILED TO SEND EMAIL");
            System.err.println("========================================");
            System.err.println("Error: " + e.getMessage());
            System.err.println("========================================\n");
        }
    }

    public void sendBookingReminder(String to, String name, String eventName, String eventType, String date,
            String venue) {
        String subject = "Reminder: Upcoming Event - " + eventName;
        String text = String.format(
                "Dear %s,\n\n" +
                        "This is a friendly reminder for your upcoming event:\n\n" +
                        "Event Name: %s\n" +
                        "Event Type: %s\n" +
                        "Date: %s\n" +
                        "Venue: %s\n\n" +
                        "We look forward to making your event memorable!\n\n" +
                        "Best Regards,\n" +
                        "Aurora Events Team",
                name, eventName, eventType, date, venue);
        sendSimpleMessage(to, subject, text);
    }

    public void sendBookingDetailsToPlanner(String plannerEmail, String bookingDetails) {
        String subject = "New Booking Assignment";
        String text = "Hello Planner,\n\nYou have been assigned a new booking. Here are the details:\n\n"
                + bookingDetails + "\n\nPlease review and prepare accordingly.\n\nBest Regards,\nAurora Events Admin";
        sendSimpleMessage(plannerEmail, subject, text);
    }
}
