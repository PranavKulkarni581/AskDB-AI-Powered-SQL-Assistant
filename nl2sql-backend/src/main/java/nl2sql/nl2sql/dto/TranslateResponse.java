package nl2sql.nl2sql.dto;

import java.util.List;

public record TranslateResponse(
        String sql,                    // Generated SQL
        String dialect,                // SQL dialect (e.g., MySQL, PostgreSQL)
        String model,                  // Gemini model used (e.g., gemini-2.0-flash)
        long latencyMs,                // Response latency in ms
        String warning,                // Any warnings or model notes
        String explanation,            // Model explanation of SQL
        String optimizedSql,           // Optimized SQL version (if available)
        List<String> suggestions,      // Improvement or correction suggestions
        List<String> indexes,          // Index recommendations
        String complexity,             // Query complexity (e.g., LOW, MEDIUM, HIGH)
        String cost                    // Estimated cost or execution cost level
) {}

