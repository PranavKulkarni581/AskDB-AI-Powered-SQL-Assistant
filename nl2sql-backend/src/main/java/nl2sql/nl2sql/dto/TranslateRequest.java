package nl2sql.nl2sql.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TranslateRequest(
        @NotBlank @Size(max = 1000) String text,   // user input (natural language or SQL)
        @NotNull Dialect dialect,                  // SQL dialect (e.g., MYSQL, POSTGRES)
        String queryType,                          // query type like SELECT, INSERT, etc.
        String host,                               // database host
        String port,                               // database port
        String database,                           // database name
        String username,                           // DB username
        String password,                           // DB password
        boolean optimize                           // whether to run in optimization mode
) {}
