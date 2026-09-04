package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.DespachoMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DespachoMedicamentoRepository extends JpaRepository<DespachoMedicamento, Long> {
    List<DespachoMedicamento> findByEstado(String estado);
}