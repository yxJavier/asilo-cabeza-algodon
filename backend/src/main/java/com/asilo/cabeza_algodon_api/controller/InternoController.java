package com.asilo.cabeza_algodon_api.controller;

import com.asilo.cabeza_algodon_api.model.Interno;
import com.asilo.cabeza_algodon_api.service.InternoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/internos")
@CrossOrigin(origins = "http://localhost:3000") // Permite peticiones desde Next.js
public class InternoController {

    private final InternoService internoService;

    public InternoController(InternoService internoService) {
        this.internoService = internoService;
    }

    @GetMapping
    public ResponseEntity<List<Interno>> obtenerInternos() {
        return ResponseEntity.ok(internoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Interno> crearInterno(@Valid @RequestBody Interno interno) {
        Interno nuevo = internoService.registrarInterno(interno);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }
}