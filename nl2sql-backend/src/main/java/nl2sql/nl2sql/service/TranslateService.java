package nl2sql.nl2sql.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import nl2sql.nl2sql.dto.Dialect;
import nl2sql.nl2sql.dto.TranslateRequest;
import nl2sql.nl2sql.dto.TranslateResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class TranslateService {

    // 🔹 NEW GROQ URL
    private static final String GROQ_API_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    // 🔹 Load key from application.yml
    @Value("${groq.api.key}")
    private String groqApiKey;

    private final SchemaService schemaService;
    private final ObjectMapper mapper = new ObjectMapper();

    public TranslateService(SchemaService schemaService) {
        this.schemaService = schemaService;
    }

    public TranslateResponse translate(TranslateRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        long start = System.currentTimeMillis();

        Dialect dialect = request.dialect();
        String dialectName = (dialect != null) ? dialect.name() : "MYSQL";
        String text = request.text() != null ? request.text() : "";
        String queryType = request.queryType() != null ? request.queryType().toUpperCase() : "SELECT";

        // 🔹 Fetch DB schema
        String jdbcUrl = schemaService.toJdbcUrl(request.host(), request.port(), request.database());
        String schemaSummary = schemaService.fetchSchemaSummary(jdbcUrl, request.username(), request.password(), 50, 50);

        // 🔹 Build prompt (same logic as before)
        String prompt;
        if (request.optimize()) {
            prompt = """
                You are a SQL optimization engine.
                Return a STRICT JSON object with ALL of the following fields ALWAYS present:
                  "optimized_sql": string,
                  "suggestions": array of strings,
                  "indexes": array of strings,
                  "complexity": string,
                  "cost": string,
                  "explanation": string
                
                SQL Query:
                %s
                """.formatted(text);
        } else {
            prompt = String.format("""
                You are an expert at generating correct %s SQL queries for MySQL.
                Below is the **actual schema** of the target database.
                
                === SCHEMA START ===
                %s
                === SCHEMA END ===
                
                Return STRICT JSON ONLY:
                {
                  "sql": "...",
                  "explanation": "..."
                }
                
                User intent: %s
                """, queryType, schemaSummary, text);
        }

        // 🔹 Build Groq request body
        Map<String, Object> body = new HashMap<>();
        body.put("model", "groq/compound");




        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", prompt));
        body.put("messages", messages);

        // 🔹 Headers with authentication
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // 🔹 Call Groq API
        ResponseEntity<Map> response;
        try {
            response = restTemplate.postForEntity(GROQ_API_URL, entity, Map.class);
        } catch (Exception e) {
            return new TranslateResponse(
                    "Groq API call failed: " + e.getMessage(),
                    dialectName,
                    "llama-3.1-70b-versatile",
                    System.currentTimeMillis() - start,
                    "Request failed",
                    null, null, null, null, null, null
            );
        }

        String rawJson = "";
        try {
            var choices = (List<Map<String, Object>>) response.getBody().get("choices");
            var message = (Map<String, Object>) choices.get(0).get("message");
            rawJson = message.get("content").toString().trim();
        } catch (Exception e) {
            return new TranslateResponse(
                    "Groq response error: " + e.getMessage(),
                    dialectName,
                    "llama-3.1-70b-versatile",
                    System.currentTimeMillis() - start,
                    "Invalid response format",
                    null, null, null, null, null, null
            );
        }

        // 🔹 Clean up JSON
        rawJson = rawJson.replace("```json", "").replace("```", "").trim();

        JsonNode root;
        try {
            root = mapper.readTree(rawJson);
        } catch (Exception e) {
            return new TranslateResponse(
                    "JSON Parse Error: " + e.getMessage() + "\nRAW: " + rawJson,
                    dialectName,
                    "llama-3.1-70b-versatile",
                    System.currentTimeMillis() - start,
                    "Failed to parse model output",
                    null, null, null, null, null, null
            );
        }

        long latency = System.currentTimeMillis() - start;

        // 🔹 Normal mode
        if (!request.optimize()) {
            return new TranslateResponse(
                    root.path("sql").asText(""),
                    dialectName,
                    "llama-3.1-70b-versatile",
                    latency,
                    null,
                    root.path("explanation").asText(""),
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        // 🔹 Optimization mode
        List<String> suggestions = new ArrayList<>();
        List<String> indexes = new ArrayList<>();

        if (root.has("suggestions"))
            root.get("suggestions").forEach(n -> suggestions.add(n.asText()));

        if (root.has("indexes"))
            root.get("indexes").forEach(n -> indexes.add(n.asText()));

        return new TranslateResponse(
                root.path("sql").asText(""),
                dialectName,
                "llama-3.1-70b-versatile",
                latency,
                null,
                root.path("explanation").asText(""),
                root.path("optimized_sql").asText(""),
                suggestions,
                indexes,
                root.path("complexity").asText("Unknown"),
                root.path("cost").asText("Unknown")
        );
    }
}
