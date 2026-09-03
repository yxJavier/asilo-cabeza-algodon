package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.model.MedicinaCajon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicinaCajonRepository extends JpaRepository<MedicinaCajon, Long> {
    List<MedicinaCajon> findByInternoId(Long internoId);
}