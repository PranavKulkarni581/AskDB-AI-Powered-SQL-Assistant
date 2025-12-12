package nl2sql.nl2sql.service;

import nl2sql.nl2sql.dto.ExecuteRequest;
import nl2sql.nl2sql.dto.ExecuteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;

@Service
public class ExecuteService {

    @Autowired
    private DatabaseService dbConnectionService;

    public ExecuteResponse executeQuery(ExecuteRequest req) {
        List<Map<String, Object>> rows = new ArrayList<>();
        boolean success = false;
        String message = "";

        try (Connection conn = dbConnectionService.getConnection(
                req.host(),
                req.port(),
                req.database(),
                req.username(),
                req.password());
             Statement stmt = conn.createStatement()) {

            String sql = req.sql().trim();
            String queryType = req.queryType() != null ? req.queryType().toLowerCase() : "";

            // ✅ Auto-detect SELECT if SQL starts with it
            if (sql.toLowerCase().startsWith("select")) {
                queryType = "select";
            }

            switch (queryType) {
                case "select":
                    try (ResultSet rs = stmt.executeQuery(sql)) {
                        ResultSetMetaData meta = rs.getMetaData();
                        int colCount = meta.getColumnCount();

                        while (rs.next()) {
                            Map<String, Object> row = new LinkedHashMap<>();
                            for (int i = 1; i <= colCount; i++) {
                                row.put(meta.getColumnLabel(i), rs.getObject(i));
                            }
                            rows.add(row);
                        }
                        message = "SELECT query executed successfully.";
                        success = true;
                    }
                    break;

                case "insert":
                case "update":
                case "delete":
                case "create":
                case "alter":
                case "drop":
                    int affected = stmt.executeUpdate(sql);
                    success = true;
                    message = queryType.toUpperCase() + " query executed successfully. Rows affected: " + affected;
                    break;

                default:
                    message = "Unsupported or unrecognized query type: " + queryType;
            }

        } catch (SQLException e) {
            message = "SQL Execution Error: " + e.getMessage();
        } catch (Exception e) {
            message = "Error: " + e.getMessage();
        }

        return new ExecuteResponse(success, message, rows);
    }
}
