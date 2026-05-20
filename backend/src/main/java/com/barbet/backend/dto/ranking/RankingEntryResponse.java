package com.barbet.backend.dto.ranking;

public record RankingEntryResponse(
        Long customerId,
        String apelido,
        String mesaCodigo,
        long totalApostas,
        long totalCervejas,
        long totalPontos
) {
}
