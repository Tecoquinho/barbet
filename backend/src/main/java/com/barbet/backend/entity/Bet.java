package com.barbet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
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
    private Boolean acertouResultado;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal premioCervejas;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldoLiquidoCervejas;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal comissaoBarCervejas;

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
        if (acertouResultado == null) {
            acertouResultado = false;
        }
        if (premioCervejas == null) {
            premioCervejas = BigDecimal.ZERO;
        }
        if (saldoLiquidoCervejas == null) {
            saldoLiquidoCervejas = BigDecimal.ZERO;
        }
        if (comissaoBarCervejas == null) {
            comissaoBarCervejas = BigDecimal.ZERO;
        }
    }
}
