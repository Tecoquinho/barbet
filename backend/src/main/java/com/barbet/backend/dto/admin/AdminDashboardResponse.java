package com.barbet.backend.dto.admin;

import com.barbet.backend.dto.match.MatchResponse;
import com.barbet.backend.dto.ranking.RankingEntryResponse;

import java.util.List;

public record AdminDashboardResponse(
        long jogosAbertos,
        long totalApostas,
        List<MatchResponse> jogos,
        List<RankingEntryResponse> ranking
) {
}
