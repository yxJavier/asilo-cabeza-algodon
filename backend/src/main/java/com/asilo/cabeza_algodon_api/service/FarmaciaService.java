package com.asilo.cabeza_algodon_api.service;

import com.asilo.cabeza_algodon_api.model.DespachoMedicamento;
import com.asilo.cabeza_algodon_api.repository.DespachoMedicamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmaciaService {

    private final DespachoMedicamentoRepository farmaciaRepository;

    public FarmaciaService(DespachoMedicamentoRepository farmaciaRepository) {
        this.farmaciaRepository = farmaciaRepository;
    }

    public List<DespachoMedicamento> listarTodos() {
        return farmaciaRepository.findAll();
    }

    public DespachoMedicamento registrarPrescripcion(DespachoMedicamento despacho) {
        despacho.setEstado("Pendiente");
        return farmaciaRepository.save(despacho);
    }

    public DespachoMedicamento despacharYBloquear(Long id) {
        DespachoMedicamento despacho = farmaciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescripcion no encontrada con ID: " + id));

        if ("Despachado".equalsIgnoreCase(despacho.getEstado())) {
            throw new IllegalStateException("La receta ya fue despachada y se encuentra bloqueada.");
        }

        despacho.setEstado("Despachado");
        return farmaciaRepository.save(despacho);
    }
}