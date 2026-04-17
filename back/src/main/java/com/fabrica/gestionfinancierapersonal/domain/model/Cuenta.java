package com.fabrica.gestionfinancierapersonal.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fabrica.gestionfinancierapersonal.domain.enums.TipoCuenta;
import com.fabrica.gestionfinancierapersonal.domain.enums.TipoTransaccion;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import com.fabrica.gestionfinancierapersonal.domain.enums.Moneda;
import com.fabrica.gestionfinancierapersonal.domain.enums.Periodicidad;

import lombok.Getter;

@Entity
@Table(name = "cuentas")
@Getter
public class Cuenta {

    @Id
    private UUID idCuenta;
    
    private String nombre;
    private double saldo;

    @Enumerated(EnumType.STRING)
    private TipoCuenta tipo;

    @Enumerated(EnumType.STRING)
    private Moneda moneda;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "cuenta", cascade = CascadeType.ALL)
    private List<Transaccion> transacciones;

    protected Cuenta() {
    }

    public Cuenta(String nombre, TipoCuenta tipo, Moneda moneda, Usuario usuario) {

        if (tipo == null) {
            throw new IllegalArgumentException("Tipo de cuenta obligatorio");
        }

        if (moneda == null) {
            throw new IllegalArgumentException("La moneda es obligatoria");
        }
        this.tipo = tipo;

        if (tipo == TipoCuenta.BANCARIA) {
            if (nombre == null || nombre.isBlank()) {
                throw new IllegalArgumentException("El nombre es obligatorio para cuentas bancarias");
            }
            this.nombre = nombre;
        } else {
            this.nombre = "Efectivo";
        }
        this.idCuenta = UUID.randomUUID();
        this.saldo = 0.0;
        this.moneda = moneda;
        this.usuario = usuario;
        this.transacciones = new ArrayList<>();
    }

    public void registrarSaldoInicial(double monto) {

        if (monto < 0) {
            throw new IllegalArgumentException("Saldo inicial no puede ser negativo");
        }
        if (monto == 0)
            return;
        Transaccion t = new Transaccion(monto, TipoTransaccion.INGRESO, Periodicidad.OCASIONAL, this);
        agregarTransaccion(t);
    }

    public void agregarTransaccion(Transaccion transaccion) {

        if (transaccion == null) {
            throw new IllegalArgumentException("Transacción inválida");
        }
        if (transaccion.getMonto() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        }
        if (transaccion.getTipo() == TipoTransaccion.GASTO &&
                this.saldo < transaccion.getMonto()) {
            throw new IllegalArgumentException("El Saldo es insuficiente");
        }
        actualizarSaldo(transaccion);
        this.transacciones.add(transaccion);
    }

    private void actualizarSaldo(Transaccion t) {

        if (t.getTipo() == TipoTransaccion.INGRESO) {
            this.saldo += t.getMonto();
        } else {
            this.saldo -= t.getMonto();
        }
    }
}