package nl2sql.nl2sql.dto;

public record DatabaseConnectionResponse(
        boolean success,
        String message
) {}
