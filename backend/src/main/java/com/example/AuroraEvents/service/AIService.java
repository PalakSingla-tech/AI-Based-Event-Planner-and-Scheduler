package com.example.AuroraEvents.service;

import com.example.AuroraEvents.model.Planner;
import com.example.AuroraEvents.repo.PlannerRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIService {

        @Value("${gemini.api.key}")
        private String apiKey;

        private final PlannerRepo plannerRepository;
        private final RestTemplate restTemplate;

        public AIService(PlannerRepo plannerRepository) {
                this.plannerRepository = plannerRepository;
                this.restTemplate = new RestTemplate();
        }

        public String getRecommendations(String userCriteria) {
                List<Planner> allPlanners = plannerRepository.findAll();

                String plannerContext = allPlanners.stream()
                                .map(p -> String.format("%s (%s, %s)",
                                                p.getFullName(), p.getCity(), p.getSpecialization()))
                                .collect(Collectors.joining("; "));

                String prompt = String.format("""
                                You are an event planning assistant.
                                User Request: %s
                                Available Planners: %s

                                Recommend 2-3 planners. If none match, say "No matching planners".
                                Format:
                                1. **Name** - City
                                   Specialization: Type
                                   Reason: Short reason
                                """, userCriteria, plannerContext);

                return callGoogleAI(prompt);
        }

        public String predictBudget(Map<String, String> eventDetails) {
                String eventType = eventDetails.getOrDefault("type", "General");
                String guestCount = eventDetails.getOrDefault("guests", "50");
                String location = eventDetails.getOrDefault("location", "Unknown");
                String theme = eventDetails.getOrDefault("theme", "Standard");

                List<Planner> allPlanners = plannerRepository.findAll();
                String plannerContext = allPlanners.stream()
                                .map(p -> String.format("%s (%s, %s)",
                                                p.getFullName(), p.getCity(), p.getSpecialization()))
                                .collect(Collectors.joining("; "));

                String prompt = String.format("""
                                Estimate budget for: %s, %s, %s guests, %s.
                                Available Planners: %s

                                Output ONLY this format:
                                **Budget:** ₹[Min]-₹[Max]

                                **Breakdown:**
                                Venue: ₹[Amount]
                                Catering: ₹[Amount]
                                Decor: ₹[Amount]
                                Entertainment: ₹[Amount]
                                Other: ₹[Amount]

                                **Matching Planners:**
                                [List names matching location/type or "No planners found"]
                                """, eventType, theme, guestCount, location, plannerContext);

                return callGoogleAI(prompt);
        }

        public String generateEventDescription(String eventDetails) {
                String prompt = String.format(
                                """
                                                You are a creative event writer.
                                                Write a short, engaging, and professional description (max 50 words) for a past event with these details:
                                                %s
                                                Highlight the success and atmosphere.
                                                """,
                                eventDetails);
                return callGoogleAI(prompt);
        }

        private String callGoogleAI(String prompt) {
                try {
                        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                                        + apiKey;

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);

                        // Construct Gemini Request BOdy
                        // { "contents": [ { "parts": [ { "text": "..." } ] } ] }
                        Map<String, Object> requestBody = new HashMap<>();
                        Map<String, Object> contentPart = new HashMap<>();
                        Map<String, String> textPart = new HashMap<>();
                        textPart.put("text", prompt);
                        contentPart.put("parts", List.of(textPart));
                        requestBody.put("contents", List.of(contentPart));

                        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
                        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

                        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                                Map<String, Object> responseBody = response.getBody();
                                // Parse Gemini Response
                                // { "candidates": [ { "content": { "parts": [ { "text": "..." } ] } } ] }
                                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody
                                                .get("candidates");
                                if (candidates != null && !candidates.isEmpty()) {
                                        Map<String, Object> candidate = candidates.get(0);
                                        Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                                        if (content != null) {
                                                List<Map<String, Object>> parts = (List<Map<String, Object>>) content
                                                                .get("parts");
                                                if (parts != null && !parts.isEmpty()) {
                                                        return (String) parts.get(0).get("text");
                                                }
                                        }
                                }
                        }
                        return "Unable to get AI response. Please try again.";
                } catch (Exception e) {
                        System.err.println("Google AI Error: " + e.getMessage());
                        e.printStackTrace();
                        return "AI service temporarily unavailable. Please check your API key.";
                }
        }
}
