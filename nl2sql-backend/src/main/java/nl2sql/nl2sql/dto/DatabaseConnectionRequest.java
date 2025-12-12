package nl2sql.nl2sql.dto;

public record DatabaseConnectionRequest(
        String host,
        String port,
        String database,
        String username,
        String password
) {}
