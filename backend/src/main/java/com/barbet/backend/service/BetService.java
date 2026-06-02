package com.barbet.backend.service;

import com.barbet.backend.dto.customer.BetRequest;
import com.barbet.backend.dto.customer.BetResponse;
import com.barbet.backend.entity.*;
import com.barbet.backend.exception.BusinessException;
import com.barbet.backend.exception.NotFoundException;
import com.barbet.backend.repository.BetRepository;
import com.barbet.backend.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BetService {

    private final BetRepository betRepository;
    private final MatchRepository matchRepository;
    private final CustomerService customerService;
    private final MapperService mapperService;

    @Transactional
    public BetResponse create(BetRequest request) {
        Customer customer = customerService.requireById(request.clienteId());
        Match match = matchRepository.findById(request.jogoId())
                .orElseThrow(() -> new NotFoundException("Jogo nao encontrado"));

        if (match.getStatus() != MatchStatus.OPEN) {
            throw new BusinessException("Apostas fechadas para este jogo");
        }
        if (betRepository.findByClienteIdAndJogoId(customer.getId(), match.getId()).isPresent()) {
            throw new BusinessException("Cliente ja possui palpite para este jogo");
        }
        validateScore(request);

        Bet bet = betRepository.save(Bet.builder()
                .cliente(customer)
                .jogo(match)
                .mesa(customer.getMesa())
                .vencedorEscolhido(request.vencedorEscolhido())
                .placarTimeA(request.placarTimeA())
                .placarTimeB(request.placarTimeB())
                .quantidadeCervejas(request.quantidadeCervejas())
                .pontos(0)
                .acertouResultado(false)
                .premioCervejas(BigDecimal.ZERO)
                .saldoLiquidoCervejas(BigDecimal.ZERO)
                .comissaoBarCervejas(BigDecimal.ZERO)
                .build());

        return mapperService.toBetResponse(bet);
    }

    @Transactional(readOnly = true)
    public List<BetResponse> listByCustomer(Long customerId) {
        customerService.requireById(customerId);
        return betRepository.findByClienteIdOrderByCreatedAtDesc(customerId).stream()
                .map(mapperService::toBetResponse)
                .toList();
    }

    @Transactional
    public void scoreMatch(Match match) {
        if (match.getStatus() != MatchStatus.FINISHED) {
            return;
        }
        WinnerChoice finalWinner = resolveWinner(match.getGolsTimeA(), match.getGolsTimeB());
        List<Bet> bets = betRepository.findByJogoId(match.getId());
        List<Bet> winningBets = bets.stream()
                .filter(bet -> bet.getVencedorEscolhido() == finalWinner)
                .toList();
        BigDecimal totalLosingPool = bets.stream()
                .filter(bet -> bet.getVencedorEscolhido() != finalWinner)
                .map(bet -> BigDecimal.valueOf(bet.getQuantidadeCervejas()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal barCommission = winningBets.isEmpty() || totalLosingPool.signum() <= 0
                ? BigDecimal.ZERO
                : totalLosingPool.min(BigDecimal.ONE);
        BigDecimal distributablePool = totalLosingPool.subtract(barCommission);
        BigDecimal prizePerWinner = winningBets.isEmpty()
                ? BigDecimal.ZERO
                : distributablePool.divide(BigDecimal.valueOf(winningBets.size()), 2, RoundingMode.HALF_UP);

        for (Bet bet : bets) {
            boolean acertouResultado = bet.getVencedorEscolhido() == finalWinner;
            int points = 0;
            if (acertouResultado) {
                points += 3;
            }
            if (bet.getPlacarTimeA() != null && bet.getPlacarTimeB() != null
                    && bet.getPlacarTimeA().equals(match.getGolsTimeA())
                    && bet.getPlacarTimeB().equals(match.getGolsTimeB())) {
                points += 5;
            }
            bet.setPontos(points);
            bet.setAcertouResultado(acertouResultado);
            bet.setPremioCervejas(acertouResultado ? prizePerWinner : BigDecimal.ZERO);
            bet.setSaldoLiquidoCervejas(acertouResultado
                    ? prizePerWinner
                    : BigDecimal.valueOf(bet.getQuantidadeCervejas()).negate());
            bet.setComissaoBarCervejas(barCommission);
        }
        betRepository.saveAll(bets);
    }

    public long countByBar(Long barId) {
        return betRepository.countByJogo_Bar_Id(barId);
    }

    private WinnerChoice resolveWinner(Integer golsA, Integer golsB) {
        if (golsA > golsB) {
            return WinnerChoice.TEAM_A;
        }
        if (golsB > golsA) {
            return WinnerChoice.TEAM_B;
        }
        return WinnerChoice.DRAW;
    }

    private void validateScore(BetRequest request) {
        boolean hasOne = request.placarTimeA() != null || request.placarTimeB() != null;
        boolean hasBoth = request.placarTimeA() != null && request.placarTimeB() != null;
        if (hasOne && !hasBoth) {
            throw new BusinessException("Informe os dois gols para usar placar");
        }
    }
}
