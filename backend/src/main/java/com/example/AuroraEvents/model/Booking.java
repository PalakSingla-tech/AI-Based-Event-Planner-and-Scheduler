package com.example.AuroraEvents.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Full Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @NotBlank(message = "Event Type is required")
    private String eventType;

    @NotBlank(message = "Event Name is required")
    private String eventName;

    @NotNull(message = "Event Date is required")
    private Date eventDate;

    @NotBlank(message = "Venue is required")
    private String venue;

    private String status = "Pending";

    private String paymentStatus = "PENDING";
    private Integer plannerId;

    private Double totalAmount = 0.0;
    private Double paidAmount = 0.0;

    private Boolean reminderSent = false;

}
