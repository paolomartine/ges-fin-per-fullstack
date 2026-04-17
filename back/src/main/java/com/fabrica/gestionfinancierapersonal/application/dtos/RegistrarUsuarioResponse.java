package com.fabrica.gestionfinancierapersonal.application.dtos;

import java.util.UUID;

public record RegistrarUsuarioResponse(
    UUID idUsuario,
    String username,
    String nombre,
    String apellido,
    String correo) {
}