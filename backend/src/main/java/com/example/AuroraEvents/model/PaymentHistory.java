package com.example.AuroraEvents.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer bookingId;
    private String userEmail;
    private Integer plannerId;
    private double amount;
    private String paymentMethod;      // e.g., CARD (mock)
    private String transactionId;      // mock or real gateway id
    private String status;             // PAID / FAILED
    private LocalDateTime paymentDate;
}
