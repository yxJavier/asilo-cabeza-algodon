package com.asilo.cabeza_algodon_api.config;

import com.asilo.cabeza_algodon_api.entities.PersonalUsuario;
import com.asilo.cabeza_algodon_api.repository.PersonalUsuarioRepository;
import com.asilo.cabeza_algodon_api.security.Rol;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner inicializarUsuariosPrueba(
            PersonalUsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Administrador / Caja
            actualizarOCrearUsuario(
                    usuarioRepository, passwordEncoder,
                    "caja@asilo.org", "Demo2026*",
                    "Encargado de Caja y Finanzas", Rol.ADMINISTRADOR
            );

            // 2. Medico General
            actualizarOCrearUsuario(
                    usuarioRepository, passwordEncoder,
                    "medico.general@asilo.org", "Demo2026*",
                    "Dr. Carlos Mendoza", Rol.MEDICO_GENERAL
            );

            // 3. Personal de Enfermeria
            actualizarOCrearUsuario(
                    usuarioRepository, passwordEncoder,
                    "enfermeria@asilo.org", "Demo2026*",
                    "Enf. Lucia Ramirez", Rol.ENFERMERO
            );

            // 4. Coordinador de Fundacion
            actualizarOCrearUsuario(
                    usuarioRepository, passwordEncoder,
                    "coordinador@fundacion.org", "Demo2026*",
                    "Lic. Sofia Paz", Rol.COORD_FUNDACION
            );

            // 5. Medico Especialista (Geriatra)
            actualizarOCrearUsuario(
                    usuarioRepository, passwordEncoder,
                    "especialista@fundacion.org", "Demo2026*",
                    "Dr. Roberto Gomez", Rol.MEDICO_ESPECIALISTA
            );

            // 6. Laboratorista
            actualizarOCrearUsuario(
                    usuarioRepository, passwordEncoder,
                    "laboratorio@fundacion.org", "Demo2026*",
                    "Lic. Mario Estrada", Rol.LABORATORISTA
            );

            // 7. Farmaceutico
            actualizarOCrearUsuario(
                    usuarioRepository, passwordEncoder,
                    "farmacia@fundacion.org", "Demo2026*",
                    "Licda. Maria Lopez", Rol.FARMACEUTICO
            );
        };
    }

    private void actualizarOCrearUsuario(
            PersonalUsuarioRepository repo,
            PasswordEncoder encoder,
            String correo,
            String contrasenaPlana,
            String nombreCompleto,
            Rol rol) {

        PersonalUsuario usuario = repo.findByCorreo(correo).orElseGet(PersonalUsuario::new);
        usuario.setCorreo(correo);
        usuario.setContrasena(encoder.encode(contrasenaPlana)); // Cifra con BCrypt costo 12
        usuario.setNombreCompleto(nombreCompleto);
        usuario.setRol(rol);
        usuario.setActivo(true);
        repo.save(usuario);
    }
}