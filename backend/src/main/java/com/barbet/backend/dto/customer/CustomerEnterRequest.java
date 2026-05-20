package com.barbet.backend.dto.customer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CustomerEnterRequest(
        @NotBlank @Size(max = 80) String apelido,
        @Size(max = 30) @Pattern(regexp = "^[0-9+()\\-\\s]*$", message = "Telefone invalido") String telefone,
        @NotBlank String barSlug,
        @NotBlank String mesaCodigo
) {
}
