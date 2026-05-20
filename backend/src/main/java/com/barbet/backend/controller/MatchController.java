package com.barbet.backend.controller;

import com.barbet.backend.dto.match.MatchResponse;
import com.barbet.backend.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/open")
    public List<MatchResponse> listOpen(@RequestParam String barSlug) {
        return matchService.listOpen(barSlug);
    }
}
