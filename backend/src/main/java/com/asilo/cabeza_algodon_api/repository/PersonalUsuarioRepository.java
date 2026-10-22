package com.asilo.cabeza_algodon_api.repository;

import com.asilo.cabeza_algodon_api.entities.PersonalUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonalUsuarioRepository extends JpaRepository<PersonalUsuario, Long> {
    Optional<PersonalUsuario> findByCorreo(String correo);
}