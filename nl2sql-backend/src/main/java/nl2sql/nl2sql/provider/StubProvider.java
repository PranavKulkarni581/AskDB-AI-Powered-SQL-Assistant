package nl2sql.nl2sql.provider;

import nl2sql.nl2sql.dto.Dialect;
import org.springframework.stereotype.Component;

@Component
public class StubProvider implements NL2SQLProvider {

    @Override
    public String generateSql(String text, Dialect dialect) {
        String sanitized = text == null ? "" : text.trim().replaceAll("\\s+", " ");
        if (sanitized.isEmpty()) {
            return """
                   -- Describe your intent, e.g.:
                   -- "Top 10 customers by revenue in 2024"
                   SELECT * FROM table_name LIMIT 10;
                   """;
        }
        // ultra-simple illustrative template (replace with LLM later)
        return """
               -- SQL generated for: "%s"
               SELECT *
               FROM your_table
               -- TODO: refine columns, joins, filters based on intent
               LIMIT 50;
               """.formatted(sanitized);
    }
}
