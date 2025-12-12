package nl2sql.nl2sql.dto;

import java.util.List;
import java.util.Map;

public record ExecuteResponse(
        boolean success,
        String message,
        List<Map<String, Object>> rows
) {}
