package com.barbet.backend.controller;

import com.barbet.backend.dto.customer.BetRequest;
import com.barbet.backend.dto.customer.BetResponse;
import com.barbet.backend.service.BetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bets")
@RequiredArgsConstructor
public class BetController {

    private final BetService betService;

    @PostMapping
    public BetResponse create(@Valid @RequestBody BetRequest request) {
        return betService.create(request);
    }
}
