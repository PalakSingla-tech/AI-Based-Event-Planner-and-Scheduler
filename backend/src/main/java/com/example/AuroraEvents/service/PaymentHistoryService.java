package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.PaymentHistory;
import com.example.AuroraEvents.repo.PaymentHistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentHistoryService {
    @Autowired
    private PaymentHistoryRepo repo;

    public PaymentHistory save(PaymentHistory p) {
        return repo.save(p);
    }

    public List<PaymentHistory> getByUserEmail(String email) {
        return repo.findByUserEmailOrderByPaymentDateDesc(email);
    }
}
