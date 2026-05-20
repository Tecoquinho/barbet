package com.barbet.backend.dto.match;

import com.barbet.backend.entity.MatchStatus;

import java.time.OffsetDateTime;

public record MatchResponse(
        Long id,
        String timeA,
        String timeB,
        OffsetDateTime dataHora,
        MatchStatus status,
        Integer golsTimeA,
        Integer golsTimeB
) {
}
