package com.barbet.backend.service;

import com.barbet.backend.dto.customer.BetResponse;
import com.barbet.backend.dto.match.MatchResponse;
import com.barbet.backend.dto.table.TableResponse;
import com.barbet.backend.entity.BarTable;
import com.barbet.backend.entity.Bet;
import com.barbet.backend.entity.Match;
import org.springframework.stereotype.Service;

@Service
public class MapperService {

    public MatchResponse toMatchResponse(Match match) {
        return new MatchResponse(
                match.getId(),
                match.getTimeA(),
                match.getTimeB(),
                match.getDataHora(),
                match.getStatus(),
                match.getGolsTimeA(),
                match.getGolsTimeB()
        );
    }

    public BetResponse toBetResponse(Bet bet) {
        return new BetResponse(
                bet.getId(),
                bet.getJogo().getId(),
                bet.getJogo().getTimeA(),
                bet.getJogo().getTimeB(),
                bet.getVencedorEscolhido(),
                bet.getPlacarTimeA(),
                bet.getPlacarTimeB(),
                bet.getQuantidadeCervejas(),
                bet.getPontos(),
                bet.getJogo().getStatus(),
                bet.getJogo().getDataHora(),
                bet.getCreatedAt()
        );
    }

    public TableResponse toTableResponse(BarTable table) {
        return new TableResponse(
                table.getId(),
                table.getBar().getId(),
                table.getCodigo(),
                table.getDescricao(),
                table.getQrCodeUrl(),
                table.getAtiva()
        );
    }
}
