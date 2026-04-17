package com.fabrica.gestionfinancierapersonal.application.usecases;

import org.springframework.stereotype.Service;
import com.fabrica.gestionfinancierapersonal.application.dtos.LoginUsuarioRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.LoginUsuarioResponse;
import com.fabrica.gestionfinancierapersonal.application.repository.UsuarioRepository;
import com.fabrica.gestionfinancierapersonal.domain.model.Usuario;

@Service
public class LoginUsuario {

    private final UsuarioRepository usuarioRepository;

    private boolean esCorreoValido(String correo) {
        return correo != null &&
                correo.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    public LoginUsuario(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginUsuarioResponse ejecutar(LoginUsuarioRequest request) {

        // Campos obligatorios
        if (request.correo() == null || request.correo().isBlank()
                || request.contrasena() == null || request.contrasena().isBlank()) {
            throw new IllegalArgumentException("Debe completar los campos requeridos");
        }

        // Formato del correo
        if (!esCorreoValido(request.correo())) {
            throw new IllegalArgumentException("El formato del correo no es válido");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.buscarPorCorreo(request.correo())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        // Validar contraseña
        if (!usuario.getContrasena().equals(request.contrasena())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        return new LoginUsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNombre());
    }
}
