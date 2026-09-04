package com.asilo.cabeza_algodon_api.service;

import com.asilo.cabeza_algodon_api.model.SolicitudReferencia;
import com.asilo.cabeza_algodon_api.repository.SolicitudReferenciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudReferenciaService {

    private final SolicitudReferenciaRepository referenciaRepository;
    private final EmailService emailService;

    public SolicitudReferenciaService(SolicitudReferenciaRepository referenciaRepository, EmailService emailService) {
        this.referenciaRepository = referenciaRepository;
        this.emailService = emailService;
    }

    public List<SolicitudReferencia> listarTodas() {
        return referenciaRepository.findAll();
    }

    public SolicitudReferencia crearSolicitud(SolicitudReferencia solicitud) {
        // 1. Persistencia relacional en PostgreSQL
        SolicitudReferencia guardada = referenciaRepository.save(solicitud);

        // 2. Disparo asíncrono de notificación por correo (RF-017 / CU-16)
        emailService.enviarAlertaReferencia(guardada);

        return guardada;
    }
    
    public SolicitudReferencia actualizarEstado(Long id, String nuevoEstado) {
        SolicitudReferencia ref = referenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Referencia no encontrada con ID: " + id));
        ref.setEstado(nuevoEstado);
        return referenciaRepository.save(ref);
    }
}