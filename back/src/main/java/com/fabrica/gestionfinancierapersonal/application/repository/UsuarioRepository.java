package com.fabrica.gestionfinancierapersonal.application.repository;

import java.util.Optional;
import java.util.UUID;

import com.fabrica.gestionfinancierapersonal.domain.model.Usuario;

public interface UsuarioRepository {

    void guardar(Usuario usuario);

    Optional<Usuario> buscarPorId(UUID id);

    Optional<Usuario> buscarPorCorreo(String correo);

    Optional<Usuario> buscarPorUsername(String username);
}