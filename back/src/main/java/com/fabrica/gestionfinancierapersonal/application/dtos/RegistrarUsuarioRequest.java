package com.fabrica.gestionfinancierapersonal.application.dtos;

public record RegistrarUsuarioRequest(
    String username,
    String nombre,
    String apellido,
    String correo,
    String contrasena,
    String telefono) {
    }