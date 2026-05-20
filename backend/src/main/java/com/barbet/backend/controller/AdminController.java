package com.barbet.backend.controller;

import com.barbet.backend.dto.admin.AdminDashboardResponse;
import com.barbet.backend.dto.match.MatchFinishRequest;
import com.barbet.backend.dto.match.MatchRequest;
import com.barbet.backend.dto.match.MatchResponse;
import com.barbet.backend.dto.ranking.RankingEntryResponse;
import com.barbet.backend.dto.table.TableQrCodeResponse;
import com.barbet.backend.dto.table.TableRequest;
import com.barbet.backend.dto.table.TableResponse;
import com.barbet.backend.service.AdminDashboardService;
import com.barbet.backend.service.MatchService;
import com.barbet.backend.service.RankingService;
import com.barbet.backend.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MatchService matchService;
    private final RankingService rankingService;
    private final TableService tableService;
    private final AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard(@RequestParam(defaultValue = "1") Long barId) {
        return adminDashboardService.getDashboard(barId);
    }

    @PostMapping("/matches")
    public MatchResponse createMatch(@Valid @RequestBody MatchRequest request) {
        return matchService.create(request);
    }

    @PutMapping("/matches/{id}")
    public MatchResponse updateMatch(@PathVariable Long id, @Valid @RequestBody MatchRequest request) {
        return matchService.update(id, request);
    }

    @PatchMapping("/matches/{id}/close")
    public MatchResponse closeMatch(@PathVariable Long id) {
        return matchService.close(id);
    }

    @PatchMapping("/matches/{id}/finish")
    public MatchResponse finishMatch(@PathVariable Long id, @Valid @RequestBody MatchFinishRequest request) {
        return matchService.finish(id, request);
    }

    @GetMapping("/matches")
    public List<MatchResponse> listMatches(@RequestParam(defaultValue = "1") Long barId) {
        return matchService.listAll(barId);
    }

    @GetMapping("/ranking")
    public List<RankingEntryResponse> ranking(@RequestParam(defaultValue = "1") Long barId) {
        return rankingService.getRanking(barId);
    }

    @PostMapping("/tables")
    public TableResponse createTable(@Valid @RequestBody TableRequest request) {
        return tableService.create(request);
    }

    @GetMapping("/tables")
    public List<TableResponse> listTables(@RequestParam(defaultValue = "1") Long barId) {
        return tableService.list(barId);
    }

    @GetMapping("/tables/{id}/qrcode")
    public TableQrCodeResponse getQrCode(@PathVariable Long id) {
        return tableService.getQrCode(id);
    }
}
