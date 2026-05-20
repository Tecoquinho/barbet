package com.barbet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bar_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bar_id")
    private Bar bar;

    @Column(nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false, length = 2048)
    private String qrCodeUrl;

    @Column(nullable = false)
    private Boolean ativa;

    @PrePersist
    void onCreate() {
        if (ativa == null) {
            ativa = true;
        }
    }
}
