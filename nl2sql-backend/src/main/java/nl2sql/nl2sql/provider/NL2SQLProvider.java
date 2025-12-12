package nl2sql.nl2sql.provider;

import nl2sql.nl2sql.dto.Dialect;

public interface NL2SQLProvider {
    String generateSql(String text, Dialect dialect);
}