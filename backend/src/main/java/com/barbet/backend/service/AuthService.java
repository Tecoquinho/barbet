package com.barbet.backend.service;

import com.barbet.backend.config.AppProperties;
import com.barbet.backend.dto.auth.AdminLoginRequest;
import com.barbet.backend.dto.auth.AuthResponse;
import com.barbet.backend.exception.BusinessException;
import com.barbet.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppProperties appProperties;
    private final JwtService jwtService;

    public AuthResponse login(AdminLoginRequest request) {
        if (!appProperties.getAdminEmail().equalsIgnoreCase(request.email())
                || !appProperties.getAdminPassword().equals(request.password())) {
            throw new BusinessException("Credenciais invalidas");
        }

        return new AuthResponse(jwtService.generateToken(request.email()), request.email());
    }
}
