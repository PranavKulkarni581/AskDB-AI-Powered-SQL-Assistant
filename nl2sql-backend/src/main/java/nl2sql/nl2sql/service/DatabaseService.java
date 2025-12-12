package nl2sql.nl2sql.service;

import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Service
public class DatabaseService {

    // ✅ Test if a connection is successful
    public boolean testConnection(String host, String port, String database, String username, String password) {
        String url = "jdbc:mysql://" + host + ":" + port + "/" + database
                + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver"); // ensure driver is loaded
            try (Connection conn = DriverManager.getConnection(url, username, password)) {
                return conn != null && !conn.isClosed();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    // ✅ Return a live JDBC connection for executing queries
    public Connection getConnection(String host, String port, String database, String username, String password) throws SQLException {
        String url = "jdbc:mysql://" + host + ":" + port + "/" + database
                + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

        return DriverManager.getConnection(url, username, password);
    }
}
