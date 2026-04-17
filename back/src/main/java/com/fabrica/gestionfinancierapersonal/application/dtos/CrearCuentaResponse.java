package com.fabrica.gestionfinancierapersonal.application.dtos;

import java.util.UUID;
import com.fabrica.gestionfinancierapersonal.domain.enums.Moneda;
import com.fabrica.gestionfinancierapersonal.domain.enums.TipoCuenta;

public record CrearCuentaResponse(
    UUID cuentaId,
    String nombre,
    TipoCuenta tipo,
    double saldo,
    Moneda moneda) {
    }
