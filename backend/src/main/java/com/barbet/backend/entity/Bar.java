package com.barbet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "bars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (ativo == null) {
            ativo = true;
        }
    }
}
