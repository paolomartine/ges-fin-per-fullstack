package com.fabrica.gestionfinancierapersonal.domain.model;

import lombok.Getter;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fabrica.gestionfinancierapersonal.domain.enums.Periodicidad;
import com.fabrica.gestionfinancierapersonal.domain.enums.TipoTransaccion;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "transacciones")
@Getter
public class Transaccion {

    @Id
    private UUID idTransaccion;

    private double monto;

    @Enumerated(EnumType.STRING)
    private TipoTransaccion tipo;

    @Enumerated(EnumType.STRING)
    private Periodicidad periodicidad;

    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "cuenta_id")
    private Cuenta cuenta;

    protected Transaccion() {
    }

    public Transaccion(double monto, TipoTransaccion tipo, Periodicidad periodicidad, Cuenta cuenta) {

        if (monto <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        }

        if (tipo == null) {
            throw new IllegalArgumentException("El Tipo es obligatorio");
        }

        if (periodicidad == null) {
            throw new IllegalArgumentException("La Periodicidad es obligatoria");
        }

        this.idTransaccion = UUID.randomUUID();
        this.monto = monto;
        this.tipo = tipo;
        this.periodicidad = periodicidad;
        this.cuenta = cuenta;
        this.fecha = LocalDateTime.now();
    }
}
