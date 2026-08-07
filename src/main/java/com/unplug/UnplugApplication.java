package com.unplug;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;

@SpringBootApplication
public class UnplugApplication {

    public static void main(String[] args) {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl != null && !dbUrl.isBlank()) {
            configurePostgres(dbUrl);
        }
        SpringApplication.run(UnplugApplication.class, args);
    }

    // Render provides DATABASE_URL as postgres://user:pass@host:port/db
    // Spring Boot needs a proper JDBC URL + separate credentials
    private static void configurePostgres(String rawUrl) {
        try {
            URI uri = new URI(rawUrl.replaceFirst("^postgres(ql)?://", "http://"));
            String host = uri.getHost();
            int port = uri.getPort();
            String db = uri.getPath().substring(1);
            String userInfo = uri.getUserInfo();
            String user = userInfo.split(":", 2)[0];
            String pass = userInfo.split(":", 2)[1];

            String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, db);
            System.setProperty("spring.datasource.url", jdbcUrl);
            System.setProperty("spring.datasource.username", user);
            System.setProperty("spring.datasource.password", pass);
            System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
            System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
        } catch (Exception e) {
            System.err.println("Warning: could not parse DATABASE_URL, falling back to H2. " + e.getMessage());
        }
    }
}
