package com.asilo.cabeza_algodon_api.controller;

import com.asilo.cabeza_algodon_api.dto.EstadoCuentaFamiliarDTO;
import com.asilo.cabeza_algodon_api.model.Donacion;
import com.asilo.cabeza_algodon_api.model.GastoOperativo;
import com.asilo.cabeza_algodon_api.service.CajaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/caja")
public class CajaController {

    private final CajaService cajaService;

    public CajaController(CajaService cajaService) {
        this.cajaService = cajaService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Double>> obtenerResumen() {
        return ResponseEntity.ok(cajaService.obtenerResumenFinanciero());
    }

    @GetMapping("/donaciones")
    public ResponseEntity<List<Donacion>> listarDonaciones() {
        return ResponseEntity.ok(cajaService.listarDonaciones());
    }

    @PostMapping("/donaciones")
    public ResponseEntity<Donacion> registrarDonacion(@Valid @RequestBody Donacion donacion) {
        Donacion nueva = cajaService.registrarDonacion(donacion);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @GetMapping("/gastos")
    public ResponseEntity<List<GastoOperativo>> listarGastos() {
        return ResponseEntity.ok(cajaService.listarGastos());
    }

    @PostMapping("/gastos")
    public ResponseEntity<GastoOperativo> registrarGasto(@Valid @RequestBody GastoOperativo gasto) {
        GastoOperativo nuevo = cajaService.registrarGasto(gasto);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    // RF-017: Detalle de conciliacion por pagar a la Fundacion
    @GetMapping("/deuda-fundacion")
    public ResponseEntity<Map<String, Double>> obtenerDeudaFundacion() {
        return ResponseEntity.ok(cajaService.obtenerDeudaFundacion());
    }

    // RF-016: Listado detallado de cuentas corrientes por familiar
    @GetMapping("/cuentas-cobrar")
    public ResponseEntity<List<EstadoCuentaFamiliarDTO>> obtenerCuentasPorCobrar() {
        return ResponseEntity.ok(cajaService.obtenerEstadosCuentaFamiliares());
    }
}