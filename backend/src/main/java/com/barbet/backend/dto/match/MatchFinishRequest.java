package com.barbet.backend.dto.match;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MatchFinishRequest(
        @NotNull @Min(0) Integer golsTimeA,
        @NotNull @Min(0) Integer golsTimeB
) {
}
