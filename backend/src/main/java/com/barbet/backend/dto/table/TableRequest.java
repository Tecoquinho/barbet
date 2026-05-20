package com.barbet.backend.dto.table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TableRequest(
        @NotNull Long barId,
        @NotBlank String codigo,
        @NotBlank String descricao
) {
}
