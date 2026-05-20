package com.barbet.backend.service;

import com.barbet.backend.dto.customer.CustomerEnterRequest;
import com.barbet.backend.dto.customer.CustomerSessionResponse;
import com.barbet.backend.entity.BarTable;
import com.barbet.backend.entity.Customer;
import com.barbet.backend.exception.NotFoundException;
import com.barbet.backend.repository.BarTableRepository;
import com.barbet.backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final BarTableRepository tableRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public CustomerSessionResponse enter(CustomerEnterRequest request) {
        BarTable table = tableRepository.findByBar_SlugAndCodigo(request.barSlug(), request.mesaCodigo().toUpperCase())
                .orElseThrow(() -> new NotFoundException("Mesa nao encontrada"));

        Customer customer = customerRepository.save(Customer.builder()
                .apelido(sanitize(request.apelido()))
                .telefone(sanitize(request.telefone()))
                .mesa(table)
                .bar(table.getBar())
                .build());

        return new CustomerSessionResponse(
                customer.getId(),
                customer.getApelido(),
                customer.getTelefone(),
                table.getId(),
                table.getCodigo(),
                table.getBar().getNome(),
                table.getBar().getSlug()
        );
    }

    public Customer requireById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente nao encontrado"));
    }

    private String sanitize(String value) {
        return value == null ? null : value.trim().replaceAll("<", "").replaceAll(">", "");
    }
}
