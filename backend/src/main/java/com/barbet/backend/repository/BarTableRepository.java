package com.barbet.backend.repository;

import com.barbet.backend.entity.BarTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BarTableRepository extends JpaRepository<BarTable, Long> {
    Optional<BarTable> findByBar_SlugAndCodigo(String barSlug, String codigo);
    List<BarTable> findByBarIdOrderByCodigoAsc(Long barId);
    boolean existsByBarIdAndCodigoIgnoreCase(Long barId, String codigo);
}
