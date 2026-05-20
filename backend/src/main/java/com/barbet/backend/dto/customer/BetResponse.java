package com.barbet.backend.dto.customer;

import com.barbet.backend.entity.MatchStatus;
import com.barbet.backend.entity.WinnerChoice;

import java.time.OffsetDateTime;

public record BetResponse(
        Long id,
        Long jogoId,
        String timeA,
        String timeB,
        WinnerChoice vencedorEscolhido,
        Integer placarTimeA,
        Integer placarTimeB,
        Integer quantidadeCervejas,
        Integer pontos,
        MatchStatus status,
        OffsetDateTime dataHora,
        OffsetDateTime createdAt
) {
}
