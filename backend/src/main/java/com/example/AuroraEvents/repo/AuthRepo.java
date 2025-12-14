package com.example.AuroraEvents.repo;

import com.example.AuroraEvents.model.Auth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepo extends JpaRepository<Auth, Integer> {
    Optional<Auth> findByEmail(String email);
}
