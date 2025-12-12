package nl2sql.nl2sql.service;

import nl2sql.nl2sql.dto.BusinessModelRequest;
import nl2sql.nl2sql.dto.BusinessModelResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class BusinessModelService {

    // 🔥 Replace Gemini URL with Groq chat-completions URL
    private static final String GROQ_API_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    // 🔥 Read API key from application.yml
    @Value("${groq.api.key}")
    private String groqApiKey;

    private final ObjectMapper mapper = new ObjectMapper();

    public BusinessModelResponse generateSchema(BusinessModelRequest request) {

        RestTemplate restTemplate = new RestTemplate();
        long start = System.currentTimeMillis();

        // Your ORIGINAL prompt — unchanged
        String prompt =
                """
                You are an expert database architect.

                Generate a COMPLETE database schema for the following business model:

                """ + request.modelName() + """

                OUTPUT MUST BE STRICT JSON WITH FIELDS:
                {
                  "entities": [...],
                  "relationships": [...],
                  "description": "...",
                  "sql_script": "..."
                }

                RULES:
                Entities must include:
                 - name
                 - attributes → name, data_type, PK, FK, unique, AI, not_null, default

                Relationships must include:
                 - from_entity
                 - to_entity
                 - type
                 - FK details

                SQL must:
                 - be valid MySQL
                 - no comments or markdown
                 - include PK, FK, AUTO_INCREMENT
                 - be ordered correctly

                Output ONLY valid JSON.
                """;

        // 🔥 NEW GROQ REQUEST BODY (Replaces Gemini "contents")
        Map<String, Object> body = new HashMap<>();
        body.put("model", "groq/compound");


        body.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));
        body.put("temperature", 0.1);

        // 🔥 NEW HEADERS — use Bearer token instead of Gemini key
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        String schemaDescription = "";
        String sqlScript = "";
        String error = null;

        try {
            // 🔥 CALL GROQ
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(GROQ_API_URL, entity, Map.class);

            // 🔥 Extract content from:
            // choices[0].message.content
            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) response.getBody().get("choices");

            String raw = ((Map<String, Object>) choices.get(0).get("message"))
                    .get("content").toString();

            // Cleanup JSON fences if any
            raw = raw.replace("```json", "").replace("```", "").trim();

            // Parse JSON
            var root = mapper.readTree(raw);

            sqlScript = root.path("sql_script").asText("");

            ((com.fasterxml.jackson.databind.node.ObjectNode) root).remove("sql_script");

            schemaDescription = root.toString();

        } catch (Exception e) {
            e.printStackTrace();
            schemaDescription = "{\"entities\":[],\"relationships\":[],\"description\":\"Error generating schema\"}";
            sqlScript = "";
            error = e.getMessage();
        }

        long latency = System.currentTimeMillis() - start;

        return new BusinessModelResponse(
                request.modelName(),
                schemaDescription,
                null,
                latency,
                error,
                sqlScript
        );
    }
}
