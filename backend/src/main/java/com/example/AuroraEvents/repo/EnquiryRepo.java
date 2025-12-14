package com.example.AuroraEvents.repo;

import com.example.AuroraEvents.model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepo extends JpaRepository<Enquiry, Integer> {
    List<Enquiry> findByEmail(String email);
}
