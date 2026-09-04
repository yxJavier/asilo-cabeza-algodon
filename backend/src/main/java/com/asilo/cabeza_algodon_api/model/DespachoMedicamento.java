package com.asilo.cabeza_algodon_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "despacho_medicamento")
public class DespachoMedicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del interno es obligatorio")
    @Column(name = "id_interno", nullable = false)
    private Long idInterno;

    @NotBlank(message = "El nombre del residente es obligatorio")
    @Column(nullable = false, length = 150)
    private String nombreInterno;

    @NotBlank(message = "El medicamento es obligatorio")
    @Column(nullable = false, length = 120)
    private String medicamento;

    @NotNull(message = "La cantidad es obligatoria")
    @Column(nullable = false)
    private Integer cantidad;

    @NotNull(message = "El costo preferencial es obligatorio")
    @Column(nullable = false)
    private Double costoPreferencial;

    @Column(nullable = false, length = 30)
    private String estado = "Pendiente"; // Pendiente, Despachado

    @Column(nullable = false)
    private LocalDate fechaDespacho;

    @PrePersist
    protected void onCreate() {
        this.fechaDespacho = LocalDate.now();
        if (this.estado == null) this.estado = "Pendiente";
    }

    public DespachoMedicamento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdInterno() { return idInterno; }
    public void setIdInterno(Long idInterno) { this.idInterno = idInterno; }

    public String getNombreInterno() { return nombreInterno; }
    public void setNombreInterno(String nombreInterno) { this.nombreInterno = nombreInterno; }

    public String getMedicamento() { return medicamento; }
    public void setMedicamento(String medicamento) { this.medicamento = medicamento; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getCostoPreferencial() { return costoPreferencial; }
    public void setCostoPreferencial(Double costoPreferencial) { this.costoPreferencial = costoPreferencial; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDate getFechaDespacho() { return fechaDespacho; }
    public void setFechaDespacho(LocalDate fechaDespacho) { this.fechaDespacho = fechaDespacho; }
}