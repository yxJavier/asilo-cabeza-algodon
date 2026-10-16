package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.entities.PersonalUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalUsuarioRepository extends JpaRepository<PersonalUsuario, Long> {
    Optional<PersonalUsuario> findByCorreo(String correo);
}