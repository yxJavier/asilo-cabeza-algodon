package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.GastoOperativo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GastoOperativoRepository extends JpaRepository<GastoOperativo, Long> {
}