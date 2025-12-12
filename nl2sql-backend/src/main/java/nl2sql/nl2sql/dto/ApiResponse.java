package nl2sql.nl2sql.dto;

import java.util.List;
import java.util.Map;

public record ApiResponse(
        boolean success,
        String message,
        String sql,
        List<Map<String, Object>> rows
) {}
