package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.OrdenLaboratorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenLaboratorioRepository extends JpaRepository<OrdenLaboratorio, Long> {
    List<OrdenLaboratorio> findByEstado(String estado);
}