package com.barbet.backend.service;

import com.barbet.backend.dto.match.MatchFinishRequest;
import com.barbet.backend.dto.match.MatchRequest;
import com.barbet.backend.dto.match.MatchResponse;
import com.barbet.backend.entity.Bar;
import com.barbet.backend.entity.Match;
import com.barbet.backend.entity.MatchStatus;
import com.barbet.backend.exception.BusinessException;
import com.barbet.backend.exception.NotFoundException;
import com.barbet.backend.repository.BarRepository;
import com.barbet.backend.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final BarRepository barRepository;
    private final MapperService mapperService;
    private final BetService betService;

    @Transactional(readOnly = true)
    public List<MatchResponse> listOpen(String barSlug) {
        return matchRepository.findByBar_SlugAndStatusOrderByDataHoraAsc(barSlug, MatchStatus.OPEN).stream()
                .map(mapperService::toMatchResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MatchResponse> listAll(Long barId) {
        return matchRepository.findByBarIdOrderByDataHoraAsc(barId).stream()
                .map(mapperService::toMatchResponse)
                .toList();
    }

    @Transactional
    public MatchResponse create(MatchRequest request) {
        Bar bar = barRepository.findById(request.barId())
                .orElseThrow(() -> new NotFoundException("Bar nao encontrado"));

        Match match = matchRepository.save(Match.builder()
                .bar(bar)
                .timeA(sanitize(request.timeA()))
                .timeB(sanitize(request.timeB()))
                .dataHora(request.dataHora())
                .status(MatchStatus.OPEN)
                .build());

        return mapperService.toMatchResponse(match);
    }

    @Transactional
    public MatchResponse update(Long id, MatchRequest request) {
        Match match = requireById(id);
        if (match.getStatus() == MatchStatus.FINISHED) {
            throw new BusinessException("Jogo finalizado nao pode ser editado");
        }

        match.setTimeA(sanitize(request.timeA()));
        match.setTimeB(sanitize(request.timeB()));
        match.setDataHora(request.dataHora());
        return mapperService.toMatchResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse close(Long id) {
        Match match = requireById(id);
        if (match.getStatus() != MatchStatus.OPEN) {
            throw new BusinessException("Somente jogos abertos podem ser fechados");
        }
        match.setStatus(MatchStatus.CLOSED);
        return mapperService.toMatchResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse finish(Long id, MatchFinishRequest request) {
        Match match = requireById(id);
        match.setGolsTimeA(request.golsTimeA());
        match.setGolsTimeB(request.golsTimeB());
        match.setStatus(MatchStatus.FINISHED);
        Match saved = matchRepository.save(match);
        betService.scoreMatch(saved);
        return mapperService.toMatchResponse(saved);
    }

    public Match requireById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Jogo nao encontrado"));
    }

    private String sanitize(String value) {
        return value == null ? null : value.trim().replaceAll("\\s{2,}", " ");
    }
}
