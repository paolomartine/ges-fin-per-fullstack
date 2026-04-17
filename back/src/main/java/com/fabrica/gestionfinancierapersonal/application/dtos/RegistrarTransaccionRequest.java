package com.fabrica.gestionfinancierapersonal.application.dtos;

import java.util.UUID;

public record RegistrarTransaccionRequest(
    UUID idUsuario,
    UUID idCuenta,
    double monto,
    String tipoTransaccion, 
    String periodicidad) {
    }