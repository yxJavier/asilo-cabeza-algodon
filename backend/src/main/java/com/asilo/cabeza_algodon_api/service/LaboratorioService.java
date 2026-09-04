package com.asilo.cabeza_algodon_api.service;

import com.asilo.cabeza_algodon_api.model.OrdenLaboratorio;
import com.asilo.cabeza_algodon_api.repository.OrdenLaboratorioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaboratorioService {

    private final OrdenLaboratorioRepository laboratorioRepository;

    public LaboratorioService(OrdenLaboratorioRepository laboratorioRepository) {
        this.laboratorioRepository = laboratorioRepository;
    }

    public List<OrdenLaboratorio> listarTodas() {
        return laboratorioRepository.findAll();
    }

    public OrdenLaboratorio crearOrden(OrdenLaboratorio orden) {
        if (orden.getEstado() == null || orden.getEstado().isBlank()) {
            orden.setEstado("Pendiente");
        }
        return laboratorioRepository.save(orden);
    }

    public OrdenLaboratorio registrarResultado(Long id, String resultado) {
        OrdenLaboratorio orden = laboratorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + id));
        orden.setResultado(resultado);
        orden.setEstado("Completado");
        return laboratorioRepository.save(orden);
    }
}