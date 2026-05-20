package com.barbet.backend.controller;

import com.barbet.backend.dto.customer.BetResponse;
import com.barbet.backend.dto.customer.CustomerEnterRequest;
import com.barbet.backend.dto.customer.CustomerSessionResponse;
import com.barbet.backend.service.BetService;
import com.barbet.backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final BetService betService;

    @PostMapping("/enter")
    public CustomerSessionResponse enter(@Valid @RequestBody CustomerEnterRequest request) {
        return customerService.enter(request);
    }

    @GetMapping("/{id}/bets")
    public List<BetResponse> listBets(@PathVariable Long id) {
        return betService.listByCustomer(id);
    }
}
