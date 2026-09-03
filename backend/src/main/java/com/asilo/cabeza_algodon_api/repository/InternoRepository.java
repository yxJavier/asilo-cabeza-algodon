package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.Interno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InternoRepository extends JpaRepository<Interno, Long> {
    // Hereda automáticamente: save, findAll, findById, deleteById, count, etc.
}