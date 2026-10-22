package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.OrdenLaboratorio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenLaboratorioRepository extends JpaRepository<OrdenLaboratorio, Long> {
    List<OrdenLaboratorio> findByEstado(String estado);
}