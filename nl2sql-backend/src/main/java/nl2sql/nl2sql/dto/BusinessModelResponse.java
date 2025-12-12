package nl2sql.nl2sql.dto;

public record BusinessModelResponse(
        String modelName,
        String schemaDescription, // Explanation of entities and attributes
        String erDiagram,         // Optional: textual ER diagram description
        long latency,
        String error,
        String sqlScript

) {}
