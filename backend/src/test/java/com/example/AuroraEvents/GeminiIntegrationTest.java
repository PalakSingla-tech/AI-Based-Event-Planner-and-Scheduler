package com.example.AuroraEvents;

import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GeminiIntegrationTest {

    public static void main(String[] args) {
        String apiKey = "AIzaSyDCUtXlak6aR_JP0m3eUtRAPV21SYcgoto";
        String prompt = "Write a friendly 3-line introduction about microservices for a junior backend engineer.";

        String result = callGeminiAPI(apiKey, prompt);
        System.out.println("=== GEMINI API RESPONSE ===");
        System.out.println(result);
        System.out.println("=== END RESPONSE ===");
    }

    private static String callGeminiAPI(String apiKey, String prompt) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                    + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct Gemini Request Body
            // { "contents": [ { "parts": [ { "text": "..." } ] } ] }
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> contentPart = new HashMap<>();
            Map<String, String> textPart = new HashMap<>();
            textPart.put("text", prompt);
            contentPart.put("parts", List.of(textPart));
            requestBody.put("contents", List.of(contentPart));

            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                // Parse Gemini Response
                // { "candidates": [ { "content": { "parts": [ { "text": "..." } ] } } ] }
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                    if (content != null) {
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
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
            return "AI service temporarily unavailable. Error: " + e.getMessage();
        }
    }
}
