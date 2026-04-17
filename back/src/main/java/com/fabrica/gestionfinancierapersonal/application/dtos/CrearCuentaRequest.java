package com.fabrica.gestionfinancierapersonal.application.dtos;

import java.util.UUID;

public record CrearCuentaRequest(
    UUID idUsuario,
    String nombre,
    String tipo,
    double saldoInicial,
    String moneda) {
    }
