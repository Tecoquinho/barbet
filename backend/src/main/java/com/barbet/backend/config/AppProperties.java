package com.barbet.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Jwt jwt = new Jwt();
    private String adminEmail;
    private String adminPassword;
    private String frontendBaseUrl;

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expirationMinutes;
    }
}
