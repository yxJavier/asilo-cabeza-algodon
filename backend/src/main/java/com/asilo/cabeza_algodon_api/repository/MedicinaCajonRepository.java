package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.MedicinaCajon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicinaCajonRepository extends JpaRepository<MedicinaCajon, Long> {
    List<MedicinaCajon> findByInternoId(Long internoId);
}