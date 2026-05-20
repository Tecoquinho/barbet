package com.barbet.backend.dto.table;

public record TableResponse(
        Long id,
        Long barId,
        String codigo,
        String descricao,
        String qrCodeUrl,
        Boolean ativa
) {
}
