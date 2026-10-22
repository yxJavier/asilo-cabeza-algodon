package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.SolicitudReferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitudReferenciaRepository extends JpaRepository<SolicitudReferencia, Long> {
    List<SolicitudReferencia> findByEstado(String estado);
}