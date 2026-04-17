package com.fabrica.gestionfinancierapersonal.application.dtos;

public record LoginUsuarioRequest(
    String correo,
    String contrasena) {
    }
