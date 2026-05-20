package com.barbet.backend.dto;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.List;

@Builder
public record ApiErrorResponse(
        OffsetDateTime timestamp,
        int status,
        String error,
        List<String> details
) {
}
