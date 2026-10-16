package com.asilo.cabeza_algodon_api.controller;

import com.asilo.cabeza_algodon_api.entities.PersonalUsuario;
import com.asilo.cabeza_algodon_api.repository.PersonalUsuarioRepository;
import com.asilo.cabeza_algodon_api.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final PersonalUsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(PersonalUsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // DTO simple para login
    public record LoginRequest(String correo, String contrasena) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        PersonalUsuario usuario = usuarioRepository.findByCorreo(request.correo()).orElse(null);

        if (usuario == null || !passwordEncoder.matches(request.contrasena(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", "Credenciales incorrectas"));
        }

        String token = jwtService.generarToken(usuario.getUsername(), usuario.getRol().name(), usuario.getNombreCompleto());

        return ResponseEntity.ok(Map.of(
                "idUsuario", usuario.getId(),
                "nombreCompleto", usuario.getNombreCompleto(),
                "correo", usuario.getUsername(),
                "rol", usuario.getRol().name(),
                "tokenJwt", token
        ));
    }
}