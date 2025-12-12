package nl2sql.nl2sql.service;

import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;

@Service
public class SchemaService {

    /**
     * Returns a concise schema description for the given connection.
     * Limits number of tables and columns for safety.
     */
    public String fetchSchemaSummary(String jdbcUrl, String username, String password, int maxTables, int maxColsPerTable) {
        StringBuilder sb = new StringBuilder();
        try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password)) {
            DatabaseMetaData md = conn.getMetaData();

            // Get tables (TABLE and maybe VIEW)
            try (ResultSet tablesRs = md.getTables(conn.getCatalog(), null, "%", new String[]{"TABLE", "VIEW"})) {
                int tableCount = 0;
                while (tablesRs.next() && tableCount < maxTables) {
                    String tableName = tablesRs.getString("TABLE_NAME");
                    sb.append("TABLE: ").append(tableName).append("\n");

                    // Get columns for this table
                    try (ResultSet colRs = md.getColumns(conn.getCatalog(), null, tableName, "%")) {
                        int colCount = 0;
                        while (colRs.next() && colCount < maxColsPerTable) {
                            String colName = colRs.getString("COLUMN_NAME");
                            String colType = colRs.getString("TYPE_NAME");
                            int colSize = colRs.getInt("COLUMN_SIZE");
                            sb.append("  - ").append(colName).append(" ").append(colType);
                            if (colSize > 0) sb.append("(").append(colSize).append(")");
                            sb.append("\n");
                            colCount++;
                        }
                        if (colCount == maxColsPerTable) sb.append("  - ... (more columns truncated)\n");
                    }

                    tableCount++;
                }
                if (tableCount == maxTables) sb.append("... (more tables truncated)\n");
            }
        } catch (SQLException ex) {
            // On failure, return a short message — do NOT include stack traces in prompt
            return "SCHEMA-ERROR: Unable to fetch schema: " + ex.getMessage();
        }
        return sb.toString().trim();
    }

    // Convenience helper for MySQL JDBC url
    public String toJdbcUrl(String host, String port, String database) {
        if (port == null || port.isBlank()) port = "3306";
        return String.format("jdbc:mysql://%s:%s/%s?useSSL=false&allowPublicKeyRetrieval=true", host, port, database);
    }
}
