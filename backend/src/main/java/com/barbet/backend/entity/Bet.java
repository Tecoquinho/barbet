package com.barbet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "bets", uniqueConstraints = {
        @UniqueConstraint(name = "uk_customer_match", columnNames = {"cliente_id", "jogo_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Customer cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "jogo_id")
    private Match jogo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mesa_id")
    private BarTable mesa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WinnerChoice vencedorEscolhido;

    private Integer placarTimeA;

    private Integer placarTimeB;

    @Column(nullable = false)
    private Integer quantidadeCervejas;

    @Column(nullable = false)
    private Integer pontos;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (pontos == null) {
            pontos = 0;
        }
    }
}
