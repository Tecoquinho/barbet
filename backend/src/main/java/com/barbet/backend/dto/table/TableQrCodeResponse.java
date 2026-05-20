package com.barbet.backend.dto.table;

public record TableQrCodeResponse(
        String codigo,
        String targetUrl,
        String qrCodeDataUrl
) {
}
