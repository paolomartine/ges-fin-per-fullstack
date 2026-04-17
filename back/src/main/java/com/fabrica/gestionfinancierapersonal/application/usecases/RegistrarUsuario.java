package com.fabrica.gestionfinancierapersonal.application.usecases;

import org.springframework.stereotype.Service;
import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarUsuarioRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarUsuarioResponse;
import com.fabrica.gestionfinancierapersonal.application.repository.UsuarioRepository;
import com.fabrica.gestionfinancierapersonal.domain.model.Usuario;

@Service
public class RegistrarUsuario {

    private final UsuarioRepository usuarioRepository;

    public RegistrarUsuario(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public RegistrarUsuarioResponse ejecutar(RegistrarUsuarioRequest request) {

        // Validar campos obligatorios
        if (esCampoVacio(request.nombre()) ||
                esCampoVacio(request.correo()) ||
                esCampoVacio(request.contrasena()) ||
                esCampoVacio(request.telefono())) {

            throw new IllegalArgumentException("Todos los campos son obligatorios");
        }

        if (usuarioRepository.buscarPorUsername(request.username()).isPresent()) {
            throw new IllegalArgumentException("El username ya existe");
        }

        if (!request.nombre().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ' -]{3,15}$")) {
            throw new IllegalArgumentException("Nombre inválido");
        }

        if (!request.apellido().matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ' -]{3,15}$")) {
            throw new IllegalArgumentException("Apellido inválido");
        }

        if (!esCorreoValido(request.correo())) {
            throw new IllegalArgumentException("Formato de correo inválido");
        }

        if (usuarioRepository.buscarPorCorreo(request.correo()).isPresent()) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        if (!esContrasenaValida(request.contrasena())) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial");
        }

        if (request.telefono() == null || !request.telefono().matches("\\d{10}")) {
            throw new IllegalArgumentException("El teléfono debe tener 10 dígitos numéricos");
        }

        Usuario usuario = new Usuario(
                request.username(),
                request.nombre(),
                request.apellido(),
                request.correo(),
                request.contrasena(),
                request.telefono());

        // Guardar
        usuarioRepository.guardar(usuario);

        // Retornar respuesta
        return new RegistrarUsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getUsername(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCorreo());
    }

    // Validaciones

    private boolean esCampoVacio(String campo) {
        return campo == null || campo.isBlank();
    }

    private boolean esCorreoValido(String correo) {
        return correo != null && correo.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private boolean esContrasenaValida(String contrasena) {
        if (contrasena == null || contrasena.length() < 8) {
            return false;
        }

        boolean tieneMayuscula = contrasena.matches(".*[A-Z].*");
        boolean tieneMinuscula = contrasena.matches(".*[a-z].*");
        boolean tieneNumero = contrasena.matches(".*\\d.*");
        boolean tieneEspecial = contrasena.matches(".*[@$!%*?&].*");

        return tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial;
    }
}
