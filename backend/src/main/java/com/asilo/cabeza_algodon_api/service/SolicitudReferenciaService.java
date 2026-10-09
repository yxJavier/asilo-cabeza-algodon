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
        // 1. Guardar la entidad en PostgreSQL
        SolicitudReferencia guardada = referenciaRepository.save(solicitud);

        // 2. Disparar correo asincrono con los datos reales del formulario (RF-017)
        try {
            emailService.enviarNotificacion(
                guardada.getCorreoFamiliar(),
                guardada.getNombreInterno(),
                guardada.getEspecialidad()
            );
        } catch (Exception ex) {
            System.err.println("No se pudo iniciar el envio de correo: " + ex.getMessage());
        }

        return guardada;
    }
    
    public SolicitudReferencia actualizarEstado(Long id, String nuevoEstado) {
        SolicitudReferencia ref = referenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Referencia no encontrada con ID: " + id));
        ref.setEstado(nuevoEstado);
        return referenciaRepository.save(ref);
    }
}