package com.barbet.backend.dto.customer;

import com.barbet.backend.entity.WinnerChoice;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BetRequest(
        @NotNull Long clienteId,
        @NotNull Long jogoId,
        @NotNull WinnerChoice vencedorEscolhido,
        @Min(0) Integer placarTimeA,
        @Min(0) Integer placarTimeB,
        @NotNull @Min(1) @Max(20) Integer quantidadeCervejas
) {
}
