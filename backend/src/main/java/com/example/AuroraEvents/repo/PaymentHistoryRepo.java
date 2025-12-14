package com.example.AuroraEvents.repo;

import com.example.AuroraEvents.model.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentHistoryRepo extends JpaRepository<PaymentHistory, Long> {
    List<PaymentHistory> findByUserEmailOrderByPaymentDateDesc(String userEmail);
}
