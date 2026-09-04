package com.asilo.cabeza_algodon_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_referencia")
public class SolicitudReferencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del interno es obligatorio")
    @Column(nullable = false, length = 150)
    private String nombreInterno;

    @NotBlank(message = "La especialidad requerida es obligatoria")
    @Column(nullable = false, length = 80)
    private String especialidad;

    @NotBlank(message = "El correo de notificación es obligatorio")
    @Email(message = "Debe proporcionar un correo electrónico válido")
    @Column(nullable = false, length = 120)
    private String correoFamiliar;

    @NotBlank(message = "El motivo de la derivación es obligatorio")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String motivo;

    @Column(nullable = false, length = 40)
    private String estado = "Pendiente";

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.estado == null || this.estado.isBlank()) {
            this.estado = "Pendiente";
        }
    }

    public SolicitudReferencia() {}

    public SolicitudReferencia(String nombreInterno, String especialidad, String correoFamiliar, String motivo) {
        this.nombreInterno = nombreInterno;
        this.especialidad = especialidad;
        this.correoFamiliar = correoFamiliar;
        this.motivo = motivo;
        this.estado = "Pendiente";
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreInterno() { return nombreInterno; }
    public void setNombreInterno(String nombreInterno) { this.nombreInterno = nombreInterno; }

    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }

    public String getCorreoFamiliar() { return correoFamiliar; }
    public void setCorreoFamiliar(String correoFamiliar) { this.correoFamiliar = correoFamiliar; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}