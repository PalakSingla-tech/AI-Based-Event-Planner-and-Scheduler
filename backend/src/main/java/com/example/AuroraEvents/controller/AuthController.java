package com.example.AuroraEvents.controller;

import com.example.AuroraEvents.model.Auth;
import com.example.AuroraEvents.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private AuthService service;

    private String adminDashboard = "redirect:/adminDashboard";
    private String userDashboard = "redirect:/dashboard";

    // register end-point
    @PostMapping("/register")
    public Auth register(@RequestParam String fullName, @RequestParam String email, @RequestParam String password, @RequestParam String confirmPassword, @RequestParam String role)
    {
        Auth auth = service.registerUser(fullName, email, password, confirmPassword, role);
        return auth;
    }

    // admin register end-point
    @PostMapping("/adminRegister")
    public Auth registerAdmin(@RequestParam String fullName, @RequestParam String email, @RequestParam String password, @RequestParam String confirmPassword, @RequestParam String role)
    {
        Auth auth = service.registerUser(fullName, email, password, confirmPassword, role);
        return auth;
    }

    //login end-point
    @PostMapping("/login")
    public Auth login(@RequestParam String email, @RequestParam String password)
    {
        Auth auth = service.authenticateUser(email, password);
        return auth;
    }

    // home page after login
    @GetMapping("/dashboard")
    public String dashboard()
    {
        return "dashboard";
    }

    // get user profile
    @GetMapping("/profile/{email}")
    public Optional<Auth> getProfile(@PathVariable String email) {
        return service.getUserByEmail(email);
    }

    // updating the user profile
    @PutMapping("/updateProfile")
    public Auth updateProfile(@RequestParam String fullName, @RequestParam String email, @RequestParam String phone, @RequestParam String city) {
        return service.updateUserProfile(fullName, email, phone, city);
    }

    // Remove user
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable int id) {
        service.deleteUser(id);
    }

    // Fetch all users (for Manage Users page)
    @GetMapping("/users")
    public Iterable<Auth> getAllUsers() {
        return service.getAllUsers();
    }
}
