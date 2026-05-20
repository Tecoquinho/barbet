package com.barbet.backend.repository;

import com.barbet.backend.entity.Bar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BarRepository extends JpaRepository<Bar, Long> {
    Optional<Bar> findBySlug(String slug);
}
