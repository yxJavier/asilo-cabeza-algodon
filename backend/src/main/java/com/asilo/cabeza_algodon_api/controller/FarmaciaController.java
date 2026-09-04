package com.asilo.cabeza_algodon_api.controller;

import com.asilo.cabeza_algodon_api.model.DespachoMedicamento;
import com.asilo.cabeza_algodon_api.service.FarmaciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/farmacia")
public class FarmaciaController {

    private final FarmaciaService farmaciaService;

    public FarmaciaController(FarmaciaService farmaciaService) {
        this.farmaciaService = farmaciaService;
    }

    @GetMapping
    public ResponseEntity<List<DespachoMedicamento>> obtenerDespachos() {
        return ResponseEntity.ok(farmaciaService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<DespachoMedicamento> registrarPrescripcion(@Valid @RequestBody DespachoMedicamento despacho) {
        DespachoMedicamento nuevo = farmaciaService.registrarPrescripcion(despacho);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/despachar")
    public ResponseEntity<DespachoMedicamento> despacharReceta(@PathVariable Long id) {
        DespachoMedicamento actualizado = farmaciaService.despacharYBloquear(id);
        return ResponseEntity.ok(actualizado);
    }
}