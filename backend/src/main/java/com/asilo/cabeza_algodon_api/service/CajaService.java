package com.asilo.cabeza_algodon_api.service;

import com.asilo.cabeza_algodon_api.dto.EstadoCuentaFamiliarDTO;
import com.asilo.cabeza_algodon_api.model.Donacion;
import com.asilo.cabeza_algodon_api.model.GastoOperativo;
import com.asilo.cabeza_algodon_api.model.Interno;
import com.asilo.cabeza_algodon_api.model.OrdenLaboratorio;
import com.asilo.cabeza_algodon_api.model.DespachoMedicamento;
import com.asilo.cabeza_algodon_api.repository.DonacionRepository;
import com.asilo.cabeza_algodon_api.repository.GastoOperativoRepository;
import com.asilo.cabeza_algodon_api.repository.InternoRepository;
import com.asilo.cabeza_algodon_api.repository.OrdenLaboratorioRepository;
import com.asilo.cabeza_algodon_api.repository.DespachoMedicamentoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CajaService {

    private final DonacionRepository donacionRepository;
    private final GastoOperativoRepository gastoRepository;
    private final InternoRepository internoRepository;
    private final OrdenLaboratorioRepository laboratorioRepository;
    private final DespachoMedicamentoRepository farmaciaRepository;

    // Cuota mensual estandar de mantenimiento y cuidado (RF-012)
    private static final double CUOTA_MENSUAL_BASE = 1500.00;

    public CajaService(DonacionRepository donacionRepository,
                       GastoOperativoRepository gastoRepository,
                       InternoRepository internoRepository,
                       OrdenLaboratorioRepository laboratorioRepository,
                       DespachoMedicamentoRepository farmaciaRepository) {
        this.donacionRepository = donacionRepository;
        this.gastoRepository = gastoRepository;
        this.internoRepository = internoRepository;
        this.laboratorioRepository = laboratorioRepository;
        this.farmaciaRepository = farmaciaRepository;
    }

    public List<Donacion> listarDonaciones() {
        return donacionRepository.findAll();
    }

    public Donacion registrarDonacion(Donacion donacion) {
        return donacionRepository.save(donacion);
    }

    public List<GastoOperativo> listarGastos() {
        return gastoRepository.findAll();
    }

    public GastoOperativo registrarGasto(GastoOperativo gasto) {
        return gastoRepository.save(gasto);
    }

    // RF-017: Control de Costos por Pagar a la Fundacion (Lab + Farmacia)
    // RF-017: Control de Costos por Pagar a la Fundacion (Lab + Farmacia)
    public Map<String, Double> obtenerDeudaFundacion() {
        double subtotalLab = laboratorioRepository.findAll().stream()
                .filter(l -> l != null && l.getCostoPreferencial() != null)
                .mapToDouble(l -> l.getCostoPreferencial())
                .sum();

        double subtotalFarmacia = farmaciaRepository.findAll().stream()
                .filter(f -> f != null && f.getCostoPreferencial() != null)
                .mapToDouble(f -> f.getCostoPreferencial())
                .sum();

        Map<String, Double> deuda = new HashMap<>();
        deuda.put("subtotalLaboratorio", subtotalLab);
        deuda.put("subtotalFarmacia", subtotalFarmacia);
        deuda.put("totalDeudaFundacion", subtotalLab + subtotalFarmacia);

        return deuda;
    }

    // RF-012, RF-013 y RF-016: Monitoreo de Saldos Pendientes por Familiar
    public List<EstadoCuentaFamiliarDTO> obtenerEstadosCuentaFamiliares() {
        List<Interno> residentes = internoRepository.findAll();
        List<OrdenLaboratorio> ordenesLab = laboratorioRepository.findAll();
        List<DespachoMedicamento> despachos = farmaciaRepository.findAll();

        List<EstadoCuentaFamiliarDTO> estadosCuenta = new ArrayList<>();

        for (Interno interno : residentes) {
            double gastoLab = ordenesLab.stream()
                    .filter(l -> l != null && l.getIdInterno() != null 
                            && l.getIdInterno().equals(interno.getId()) 
                            && l.getCostoPreferencial() != null)
                    .mapToDouble(l -> l.getCostoPreferencial())
                    .sum();

            double gastoFarmacia = despachos.stream()
                    .filter(f -> f != null && f.getIdInterno() != null 
                            && f.getIdInterno().equals(interno.getId()) 
                            && f.getCostoPreferencial() != null)
                    .mapToDouble(f -> f.getCostoPreferencial())
                    .sum();

            double saldoTotal = CUOTA_MENSUAL_BASE + gastoLab + gastoFarmacia;

            estadosCuenta.add(new EstadoCuentaFamiliarDTO(
                    interno.getId(),
                    interno.getNombreCompleto(),
                    interno.getFamiliarContacto(),
                    CUOTA_MENSUAL_BASE,
                    gastoLab,
                    gastoFarmacia,
                    saldoTotal
            ));
        }

        return estadosCuenta;
    }

    // Resumen financiero global consolidado para tesoreria (RF-016)
    public Map<String, Double> obtenerResumenFinanciero() {
        double totalDonaciones = donacionRepository.findAll().stream()
                .filter(d -> d != null && d.getMonto() != null)
                .mapToDouble(d -> d.getMonto())
                .sum();

        double totalGastos = gastoRepository.findAll().stream()
                .filter(g -> g != null && g.getMonto() != null)
                .mapToDouble(g -> g.getMonto())
                .sum();

        Map<String, Double> deudaFundacion = obtenerDeudaFundacion();
        double totalDeudaFundacion = deudaFundacion.getOrDefault("totalDeudaFundacion", 0.0);

        double totalCuentasPorCobrar = obtenerEstadosCuentaFamiliares().stream()
                .filter(e -> e != null && e.getSaldoTotalPendiente() != null)
                .mapToDouble(e -> e.getSaldoTotalPendiente())
                .sum();

        Map<String, Double> resumen = new HashMap<>();
        resumen.put("totalDonaciones", totalDonaciones);
        resumen.put("totalGastos", totalGastos);
        resumen.put("saldoNeto", totalDonaciones - totalGastos);
        resumen.put("deudaFundacion", totalDeudaFundacion);
        resumen.put("totalCuentasPorCobrar", totalCuentasPorCobrar);

        return resumen;
    }
}