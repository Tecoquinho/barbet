package com.barbet.backend.repository;

import com.barbet.backend.entity.Bet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BetRepository extends JpaRepository<Bet, Long> {
    Optional<Bet> findByClienteIdAndJogoId(Long clienteId, Long jogoId);
    List<Bet> findByClienteIdOrderByCreatedAtDesc(Long clienteId);
    List<Bet> findByJogoId(Long jogoId);
    long countByJogo_Bar_Id(Long barId);
}
