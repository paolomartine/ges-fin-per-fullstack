package com.fabrica.gestionfinancierapersonal.application.dtos;

import java.util.UUID;

public record LoginUsuarioResponse(
    UUID idUsuario,
    String nombre) {
    }
