package com.barbet.backend.service;

import com.barbet.backend.config.AppProperties;
import com.barbet.backend.dto.table.TableQrCodeResponse;
import com.barbet.backend.dto.table.TableRequest;
import com.barbet.backend.dto.table.TableResponse;
import com.barbet.backend.entity.Bar;
import com.barbet.backend.entity.BarTable;
import com.barbet.backend.exception.BusinessException;
import com.barbet.backend.exception.NotFoundException;
import com.barbet.backend.repository.BarRepository;
import com.barbet.backend.repository.BarTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final BarRepository barRepository;
    private final BarTableRepository tableRepository;
    private final MapperService mapperService;
    private final QrCodeService qrCodeService;
    private final AppProperties appProperties;

    @Transactional
    public TableResponse create(TableRequest request) {
        Bar bar = barRepository.findById(request.barId())
                .orElseThrow(() -> new NotFoundException("Bar nao encontrado"));

        String code = sanitize(request.codigo()).toUpperCase();
        if (tableRepository.existsByBarIdAndCodigoIgnoreCase(bar.getId(), code)) {
            throw new BusinessException("Ja existe uma mesa com esse codigo");
        }

        BarTable table = BarTable.builder()
                .bar(bar)
                .codigo(code)
                .descricao(sanitize(request.descricao()))
                .ativa(true)
                .qrCodeUrl(buildTargetUrl(bar.getSlug(), code))
                .build();

        return mapperService.toTableResponse(tableRepository.save(table));
    }

    @Transactional(readOnly = true)
    public List<TableResponse> list(Long barId) {
        return tableRepository.findByBarIdOrderByCodigoAsc(barId).stream()
                .map(mapperService::toTableResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TableQrCodeResponse getQrCode(Long id) {
        BarTable table = tableRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Mesa nao encontrada"));
        String targetUrl = buildTargetUrl(table.getBar().getSlug(), table.getCodigo());
        return new TableQrCodeResponse(table.getCodigo(), targetUrl, qrCodeService.generateDataUrl(targetUrl));
    }

    public String buildTargetUrl(String barSlug, String tableCode) {
        return appProperties.getFrontendBaseUrl() + "/bar/" + barSlug + "/mesa/" + tableCode;
    }

    private String sanitize(String value) {
        return value == null ? null : value.trim().replaceAll("\\s{2,}", " ");
    }
}
