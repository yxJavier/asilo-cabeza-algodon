package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonacionRepository extends JpaRepository<Donacion, Long> {
}