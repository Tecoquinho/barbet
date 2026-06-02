package com.barbet.backend.dto.customer;

import com.barbet.backend.entity.MatchStatus;
import com.barbet.backend.entity.WinnerChoice;

import java.math.BigDecimal;
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
        Boolean acertouResultado,
        BigDecimal premioCervejas,
        BigDecimal saldoLiquidoCervejas,
        BigDecimal comissaoBarCervejas,
        MatchStatus status,
        OffsetDateTime dataHora,
        OffsetDateTime createdAt
) {
}
