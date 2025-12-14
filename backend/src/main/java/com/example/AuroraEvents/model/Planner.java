package com.example.AuroraEvents.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Planner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String fullName;
    private String email;
    private String phone;
    private String city;
    private String specialization; // optional

    private String profilePhoto; // URL or path to profile photo
    private Double averageRating = 0.0; // Cached average rating
    private Integer totalRatings = 0; // Total number of ratings
}
