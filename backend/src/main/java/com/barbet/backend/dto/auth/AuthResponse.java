package com.barbet.backend.dto.auth;

public record AuthResponse(
        String token,
        String email
) {
}
