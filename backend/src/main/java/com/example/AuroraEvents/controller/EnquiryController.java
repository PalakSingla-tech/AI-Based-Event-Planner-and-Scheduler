package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Enquiry;
import com.example.AuroraEvents.service.EnquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class EnquiryController {
    @Autowired
    private EnquiryService enquiryService;

    @PostMapping("/enquiry")
    public Enquiry plannerEnquiry(@RequestParam String name, @RequestParam String email, @RequestParam String enquiryDetails)
    {
        Enquiry enquiry = enquiryService.createEnquiry(name, email, enquiryDetails);
        return enquiry;
    }

    @GetMapping("/enquiries/{email}")
    public List<Enquiry> getUserEnquiries(@PathVariable String email)
    {
        return enquiryService.getAllEnquiries(email);
    }

    @GetMapping("/enquiries")
    public List<Enquiry> getAllEnquiries()
    {
        return enquiryService.getAllEnquiries();
    }

    // Mark enquiry as replied
    @PutMapping("/enquiries/{id}/reply")
    public Enquiry updateReplyStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> body
    ) {
        String replyMessage = body.get("reply");
        return enquiryService.updateReplyStatus(id, replyMessage);
    }
}
