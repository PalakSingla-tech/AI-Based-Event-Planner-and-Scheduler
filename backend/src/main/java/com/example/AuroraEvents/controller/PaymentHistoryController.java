package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.PaymentHistory;
import com.example.AuroraEvents.service.PaymentHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/payments")
public class PaymentHistoryController {

    @Autowired
    private PaymentHistoryService service;

    @GetMapping("/{email}")
    public List<PaymentHistory> getPaymentsForUser(@PathVariable String email) {
        return service.getByUserEmail(email);
    }
}
