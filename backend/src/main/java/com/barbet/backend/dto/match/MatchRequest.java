package com.barbet.backend.dto.match;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record MatchRequest(
        @NotBlank String timeA,
        @NotBlank String timeB,
        @NotNull @Future OffsetDateTime dataHora,
        Long barId
) {
}
