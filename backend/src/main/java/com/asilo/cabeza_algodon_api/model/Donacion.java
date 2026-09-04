package com.asilo.cabeza_algodon_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Entity
@Table(name = "donaciones")
public class Donacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del donante es obligatorio")
    @Column(nullable = false, length = 150)
    private String donante;

    @NotBlank(message = "El tipo de donante es obligatorio")
    @Column(nullable = false, length = 60)
    private String tipoDonante; // Persona Particular, Empresa Nacional, Empresa Internacional, Gobierno

    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser mayor a cero")
    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private LocalDate fecha;

    @PrePersist
    protected void onCreate() {
        if (this.fecha == null) this.fecha = LocalDate.now();
    }

    public Donacion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDonante() { return donante; }
    public void setDonante(String donante) { this.donante = donante; }

    public String getTipoDonante() { return tipoDonante; }
    public void setTipoDonante(String tipoDonante) { this.tipoDonante = tipoDonante; }

    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}