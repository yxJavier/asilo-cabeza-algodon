package com.asilo.cabeza_algodon_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "internos")
public class Interno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre completo es obligatorio")
    @Column(nullable = false, length = 150)
    private String nombreCompleto;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El correo del familiar es obligatorio")
    @Column(nullable = false, length = 120)
    private String familiarContacto;

    @Column(columnDefinition = "TEXT")
    private String fichaPsicopatologica;

    @Column(nullable = false)
    private String estado = "Activo";

    public Interno() {}

    public Interno(String nombreCompleto, LocalDate fechaNacimiento, String familiarContacto, String fichaPsicopatologica) {
        this.nombreCompleto = nombreCompleto;
        this.fechaNacimiento = fechaNacimiento;
        this.familiarContacto = familiarContacto;
        this.fichaPsicopatologica = fichaPsicopatologica;
        this.estado = "Activo";
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getFamiliarContacto() { return familiarContacto; }
    public void setFamiliarContacto(String familiarContacto) { this.familiarContacto = familiarContacto; }

    public String getFichaPsicopatologica() { return fichaPsicopatologica; }
    public void setFichaPsicopatologica(String fichaPsicopatologica) { this.fichaPsicopatologica = fichaPsicopatologica; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}