package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.Auth;
import com.example.AuroraEvents.repo.AuthRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private AuthRepo repo;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Auth registerUser(String fullName, String email, String password, String confirmPassword, String role) {
        String encodedPassword = passwordEncoder.encode(password);
        Auth auth = new Auth();
        auth.setFullName(fullName);
        auth.setEmail(email);
        auth.setPassword(encodedPassword);
        auth.setRole(role);
        if(Objects.equals(password, confirmPassword))
        {
            return repo.save(auth);
        }
        else {
            throw new RuntimeException("Password did not matched");
        }
    }

    public Auth authenticateUser(String email, String password) {
        Auth auth = repo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if(passwordEncoder.matches(password, auth.getPassword())){
            return auth;
        }
        else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public Optional<Auth> getUserByEmail(String email) {
        return repo.findByEmail(email);
    }

    public Auth updateUserProfile(String fullName, String email, String phone, String city) {
        Optional<Auth> optionalUser = repo.findByEmail(email);

        if (optionalUser.isPresent()) {
            Auth user = optionalUser.get();

            // Update only non-null fields
            if (fullName != null && !fullName.isBlank()) user.setFullName(fullName);
            if (phone != null && !phone.isBlank()) user.setPhone(phone);
            if (city != null && !city.isBlank()) user.setCity(city);

            return repo.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void deleteUser(int id) {
        repo.deleteById(id);
    }

    public Iterable<Auth> getAllUsers() {
        return repo.findAll();
    }
}
