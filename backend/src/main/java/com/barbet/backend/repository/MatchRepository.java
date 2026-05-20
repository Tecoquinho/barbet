package com.barbet.backend.repository;

import com.barbet.backend.entity.Match;
import com.barbet.backend.entity.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByBar_SlugAndStatusOrderByDataHoraAsc(String barSlug, MatchStatus status);
    List<Match> findByBarIdOrderByDataHoraAsc(Long barId);
}
