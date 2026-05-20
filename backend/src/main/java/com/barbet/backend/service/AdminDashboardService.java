package com.barbet.backend.service;

import com.barbet.backend.dto.admin.AdminDashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final MatchService matchService;
    private final RankingService rankingService;
    private final BetService betService;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard(Long barId) {
        var matches = matchService.listAll(barId);
        var ranking = rankingService.getRanking(barId);
        long openMatches = matches.stream().filter(match -> match.status().name().equals("OPEN")).count();
        return new AdminDashboardResponse(openMatches, betService.countByBar(barId), matches, ranking);
    }
}
