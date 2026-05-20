package com.barbet.backend.service;

import com.barbet.backend.repository.BarRepository;
import com.barbet.backend.repository.BarTableRepository;
import com.barbet.backend.repository.MatchRepository;
import com.barbet.backend.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SeedDataService implements CommandLineRunner {

    private final BarRepository barRepository;
    private final BarTableRepository tableRepository;
    private final MatchRepository matchRepository;
    private final TableService tableService;

    @Override
    public void run(String... args) {
        if (barRepository.findBySlug("bar-do-teco").isPresent()) {
            return;
        }

        Bar bar = barRepository.save(Bar.builder()
                .nome("Bar do Teco")
                .slug("bar-do-teco")
                .endereco("Rua da Copa, 100 - Centro")
                .ativo(true)
                .build());

        List.of("MESA01", "MESA02", "MESA03").forEach(code -> tableRepository.save(BarTable.builder()
                .bar(bar)
                .codigo(code)
                .descricao("Mesa " + code.substring(code.length() - 2))
                .ativa(true)
                .qrCodeUrl(tableService.buildTargetUrl(bar.getSlug(), code))
                .build()));

        matchRepository.saveAll(List.of(
                Match.builder().bar(bar).timeA("Brasil").timeB("Argentina").dataHora(OffsetDateTime.now().plusDays(1)).status(MatchStatus.OPEN).build(),
                Match.builder().bar(bar).timeA("Franca").timeB("Alemanha").dataHora(OffsetDateTime.now().plusDays(2)).status(MatchStatus.OPEN).build(),
                Match.builder().bar(bar).timeA("Portugal").timeB("Espanha").dataHora(OffsetDateTime.now().plusDays(3)).status(MatchStatus.OPEN).build()
        ));
    }
}
