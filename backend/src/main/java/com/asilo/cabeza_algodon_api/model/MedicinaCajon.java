package com.asilo.cabeza_algodon_api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "medicamento_cajon")
public class MedicinaCajon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del medicamento es obligatorio")
    @Column(nullable = false, length = 120)
    private String nombreMedicamento;

    @NotBlank(message = "La dosis diaria es obligatoria")
    @Column(nullable = false, length = 60)
    private String dosisDiaria;

    @Column(length = 60)
    private String frecuencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_interno", nullable = false)
    @JsonBackReference // Evita bucle infinito al convertir a JSON
    private Interno interno;

    public MedicinaCajon() {}

    public MedicinaCajon(String nombreMedicamento, String dosisDiaria, String frecuencia, Interno interno) {
        this.nombreMedicamento = nombreMedicamento;
        this.dosisDiaria = dosisDiaria;
        this.frecuencia = frecuencia;
        this.interno = interno;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreMedicamento() { return nombreMedicamento; }
    public void setNombreMedicamento(String nombreMedicamento) { this.nombreMedicamento = nombreMedicamento; }

    public String getDosisDiaria() { return dosisDiaria; }
    public void setDosisDiaria(String dosisDiaria) { this.dosisDiaria = dosisDiaria; }

    public String getFrecuencia() { return frecuencia; }
    public void setFrecuencia(String frecuencia) { this.frecuencia = frecuencia; }

    public Interno getInterno() { return interno; }
    public void setInterno(Interno interno) { this.interno = interno; }
}