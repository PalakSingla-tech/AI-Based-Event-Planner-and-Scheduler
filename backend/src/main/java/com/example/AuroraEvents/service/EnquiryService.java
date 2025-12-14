package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.Enquiry;
import com.example.AuroraEvents.repo.EnquiryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EnquiryService {
    @Autowired
    private EnquiryRepo repo;

    public Enquiry createEnquiry(String name, String email, String enquiryDetails) {
        Enquiry enquiry = new Enquiry();
        enquiry.setName(name);
        enquiry.setEmail(email);
        enquiry.setEnquiryDetails(enquiryDetails);
        enquiry.setReply(null);
        return repo.save(enquiry);
    }

    public List<Enquiry> getAllEnquiries(String email) {
        return repo.findByEmail(email);
    }

    public List<Enquiry> getAllEnquiries() {
        return repo.findAll();
    }

    public Enquiry updateReplyStatus(int id, String replyMessage) {
        Enquiry e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Enquiry not found"));

        e.setReply(replyMessage);
        e.setStatus("Replied");
        return repo.save(e);
    }
}
