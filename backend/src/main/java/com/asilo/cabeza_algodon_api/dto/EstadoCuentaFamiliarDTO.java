package com.asilo.cabeza_algodon_api.dto;

public class EstadoCuentaFamiliarDTO {
    private Long idInterno;
    private String nombreInterno;
    private String familiarContacto;
    private Double cuotaMantenimiento;
    private Double totalLaboratorio;
    private Double totalFarmacia;
    private Double saldoTotalPendiente;

    public EstadoCuentaFamiliarDTO(Long idInterno, String nombreInterno, String familiarContacto, 
                                   Double cuotaMantenimiento, Double totalLaboratorio, 
                                   Double totalFarmacia, Double saldoTotalPendiente) {
        this.idInterno = idInterno;
        this.nombreInterno = nombreInterno;
        this.familiarContacto = familiarContacto;
        this.cuotaMantenimiento = cuotaMantenimiento;
        this.totalLaboratorio = totalLaboratorio;
        this.totalFarmacia = totalFarmacia;
        this.saldoTotalPendiente = saldoTotalPendiente;
    }

    public Long getIdInterno() { return idInterno; }
    public String getNombreInterno() { return nombreInterno; }
    public String getFamiliarContacto() { return familiarContacto; }
    public Double getCuotaMantenimiento() { return cuotaMantenimiento; }
    public Double getTotalLaboratorio() { return totalLaboratorio; }
    public Double getTotalFarmacia() { return totalFarmacia; }
    public Double getSaldoTotalPendiente() { return saldoTotalPendiente; }
}