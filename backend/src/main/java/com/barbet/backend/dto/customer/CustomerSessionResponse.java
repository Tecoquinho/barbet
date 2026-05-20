package com.barbet.backend.dto.customer;

public record CustomerSessionResponse(
        Long customerId,
        String apelido,
        String telefone,
        Long mesaId,
        String mesaCodigo,
        String barNome,
        String barSlug
) {
}
