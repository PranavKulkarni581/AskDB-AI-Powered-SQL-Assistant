package nl2sql.nl2sql.dto;

public record ExecuteRequest(
        String host,
        String port,
        String database,
        String username,
        String password,
        String sql,
        String queryType
) {}
