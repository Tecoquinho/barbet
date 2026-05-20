package com.barbet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bar_id")
    private Bar bar;

    @Column(nullable = false)
    private String timeA;

    @Column(nullable = false)
    private String timeB;

    @Column(nullable = false)
    private OffsetDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status;

    private Integer golsTimeA;

    private Integer golsTimeB;

    @PrePersist
    void onCreate() {
        if (status == null) {
            status = MatchStatus.OPEN;
        }
    }
}
