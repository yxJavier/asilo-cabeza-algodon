package com.asilo.cabeza_algodon_api.service;

import com.asilo.cabeza_algodon_api.model.Interno;
import com.asilo.cabeza_algodon_api.repository.InternoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InternoService {

    private final InternoRepository internoRepository;

    public InternoService(InternoRepository internoRepository) {
        this.internoRepository = internoRepository;
    }

    public List<Interno> listarTodos() {
        return internoRepository.findAll();
    }

    public Interno registrarInterno(Interno interno) {
        // Regla de negocio: asegurar que ingresa con estado Activo
        if (interno.getEstado() == null || interno.getEstado().isBlank()) {
            interno.setEstado("Activo");
        }
        return internoRepository.save(interno);
    }
}