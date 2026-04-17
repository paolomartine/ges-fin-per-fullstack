package com.fabrica.gestionfinancierapersonal.application.dtos;

import java.util.UUID;

public record RegistrarTransaccionResponse(
    UUID cuentaId,
    double saldoActual) {
    }