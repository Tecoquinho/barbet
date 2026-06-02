package com.barbet.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Jwt jwt = new Jwt();
    private String adminEmail;
    private String adminPassword;
    private String frontendBaseUrl;
    private List<String> corsAllowedOriginPatterns = List.of(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://*.vercel.app"
    );

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expirationMinutes;
    }
}
