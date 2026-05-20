package com.barbet.backend.controller;

import com.barbet.backend.dto.auth.AdminLoginRequest;
import com.barbet.backend.dto.auth.AuthResponse;
import com.barbet.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AdminLoginRequest request) {
        return authService.login(request);
    }
}
