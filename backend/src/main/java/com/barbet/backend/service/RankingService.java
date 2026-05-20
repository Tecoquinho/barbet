package com.barbet.backend.service;

import com.barbet.backend.dto.ranking.RankingEntryResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RankingService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<RankingEntryResponse> getRanking(Long barId) {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createQuery("""
                select c.id, c.apelido, m.codigo, count(b.id), coalesce(sum(b.quantidadeCervejas), 0), coalesce(sum(b.pontos), 0)
                from Bet b
                join b.cliente c
                join b.mesa m
                where c.bar.id = :barId
                group by c.id, c.apelido, m.codigo
                order by coalesce(sum(b.pontos), 0) desc, coalesce(sum(b.quantidadeCervejas), 0) desc, count(b.id) desc, c.apelido asc
                """)
                .setParameter("barId", barId)
                .getResultList();

        return rows.stream()
                .map(row -> new RankingEntryResponse(
                        (Long) row[0],
                        (String) row[1],
                        (String) row[2],
                        (Long) row[3],
                        (Long) row[4],
                        (Long) row[5]
                ))
                .toList();
    }
}
