package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.SolicitudReferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitudReferenciaRepository extends JpaRepository<SolicitudReferencia, Long> {
    List<SolicitudReferencia> findByEstado(String estado);
}