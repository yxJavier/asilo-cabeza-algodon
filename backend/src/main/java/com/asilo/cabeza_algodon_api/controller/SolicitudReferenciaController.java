package com.asilo.cabeza_algodon_api.controller;

import com.asilo.cabeza_algodon_api.model.SolicitudReferencia;
import com.asilo.cabeza_algodon_api.service.SolicitudReferenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/referencias")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class SolicitudReferenciaController {

    private final SolicitudReferenciaService referenciaService;

    public SolicitudReferenciaController(SolicitudReferenciaService referenciaService) {
        this.referenciaService = referenciaService;
    }

    @GetMapping
    public ResponseEntity<List<SolicitudReferencia>> obtenerTodas() {
        return ResponseEntity.ok(referenciaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<SolicitudReferencia> registrarReferencia(@Valid @RequestBody SolicitudReferencia solicitud) {
        SolicitudReferencia nueva = referenciaService.crearSolicitud(solicitud);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudReferencia> actualizarEstado(
            @PathVariable Long id, 
            @RequestParam String estado) {
        SolicitudReferencia actualizada = referenciaService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizada);
    }
}