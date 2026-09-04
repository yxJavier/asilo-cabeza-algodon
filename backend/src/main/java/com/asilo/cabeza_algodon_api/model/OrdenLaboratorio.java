package com.asilo.cabeza_algodon_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "orden_laboratorio")
public class OrdenLaboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del interno es obligatorio")
    @Column(name = "id_interno", nullable = false)
    private Long idInterno;

    @NotBlank(message = "El nombre del residente es obligatorio")
    @Column(nullable = false, length = 150)
    private String nombreInterno;

    @NotBlank(message = "El tipo de examen es obligatorio")
    @Column(nullable = false, length = 100)
    private String tipoExamen;

    @Column(columnDefinition = "TEXT")
    private String resultado;

    @NotNull(message = "El costo preferencial es obligatorio")
    @Column(nullable = false)
    private Double costoPreferencial;

    @Column(nullable = false, length = 30)
    private String estado = "Pendiente"; // Pendiente, Completado

    @Column(nullable = false)
    private LocalDate fechaOrden;

    @PrePersist
    protected void onCreate() {
        this.fechaOrden = LocalDate.now();
        if (this.estado == null) this.estado = "Pendiente";
    }

    public OrdenLaboratorio() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdInterno() { return idInterno; }
    public void setIdInterno(Long idInterno) { this.idInterno = idInterno; }

    public String getNombreInterno() { return nombreInterno; }
    public void setNombreInterno(String nombreInterno) { this.nombreInterno = nombreInterno; }

    public String getTipoExamen() { return tipoExamen; }
    public void setTipoExamen(String tipoExamen) { this.tipoExamen = tipoExamen; }

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public Double getCostoPreferencial() { return costoPreferencial; }
    public void setCostoPreferencial(Double costoPreferencial) { this.costoPreferencial = costoPreferencial; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDate getFechaOrden() { return fechaOrden; }
    public void setFechaOrden(LocalDate fechaOrden) { this.fechaOrden = fechaOrden; }
}