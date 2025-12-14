package com.example.AuroraEvents.repo;

import com.example.AuroraEvents.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Integer> {
    List<Booking> findByEmail(String email);

    @Query("SELECT b FROM Booking b WHERE b.eventDate BETWEEN :startDate AND :endDate AND b.reminderSent = false")
    List<Booking> findUpcomingBookingsWithoutReminder(@Param("startDate") Date startDate,
            @Param("endDate") Date endDate);
}
