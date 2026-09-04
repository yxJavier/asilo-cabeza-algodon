package com.asilo.cabeza_algodon_api.controller;

import com.asilo.cabeza_algodon_api.model.OrdenLaboratorio;
import com.asilo.cabeza_algodon_api.service.LaboratorioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/laboratorio")
public class LaboratorioController {

    private final LaboratorioService laboratorioService;

    public LaboratorioController(LaboratorioService laboratorioService) {
        this.laboratorioService = laboratorioService;
    }

    @GetMapping
    public ResponseEntity<List<OrdenLaboratorio>> obtenerOrdenes() {
        return ResponseEntity.ok(laboratorioService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<OrdenLaboratorio> registrarOrden(@Valid @RequestBody OrdenLaboratorio orden) {
        OrdenLaboratorio nueva = laboratorioService.crearOrden(orden);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/resultado")
    public ResponseEntity<OrdenLaboratorio> registrarResultado(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        String resultado = payload.getOrDefault("resultado", "Sin observaciones");
        OrdenLaboratorio actualizada = laboratorioService.registrarResultado(id, resultado);
        return ResponseEntity.ok(actualizada);
    }
}