package com.fabrica.gestionfinancierapersonal.application.usecases;

import org.springframework.stereotype.Service;

import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarTransaccionRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarTransaccionResponse;
import com.fabrica.gestionfinancierapersonal.application.repository.UsuarioRepository;
import com.fabrica.gestionfinancierapersonal.domain.enums.Periodicidad;
import com.fabrica.gestionfinancierapersonal.domain.enums.TipoTransaccion;
import com.fabrica.gestionfinancierapersonal.domain.model.Cuenta;
import com.fabrica.gestionfinancierapersonal.domain.model.Transaccion;
import com.fabrica.gestionfinancierapersonal.domain.model.Usuario;

@Service
public class RegistrarTransaccion {

    private final UsuarioRepository usuarioRepository;

    public RegistrarTransaccion(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public RegistrarTransaccionResponse ejecutar(RegistrarTransaccionRequest request) {

        // Validaciones
        if (request.idUsuario() == null) {
            throw new IllegalArgumentException("El id del usuario es obligatorio");
        }

        if (request.idCuenta() == null) {
            throw new IllegalArgumentException("El id de la cuenta es obligatorio");
        }

        if (request.monto() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        }

        if (request.tipoTransaccion() == null || request.tipoTransaccion().isBlank()) {
            throw new IllegalArgumentException("El tipo es obligatorio");
        }

        if (request.periodicidad() == null || request.periodicidad().isBlank()) {
            throw new IllegalArgumentException("La periodicidad es obligatoria");
        }

        // Convertir STRING → ENUM
        TipoTransaccion tipo;
        try {
            tipo = TipoTransaccion.valueOf(request.tipoTransaccion().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Tipo de transacción inválido");
        }

        Periodicidad periodicidad;
        try {
            periodicidad = Periodicidad.valueOf(request.periodicidad().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Periodicidad inválida");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.buscarPorId(request.idUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar cuenta dentro del usuario
        Cuenta cuenta = usuario.buscarCuentaPorId(request.idCuenta());

        // Crear transacción
        Transaccion transaccion = new Transaccion(
            request.monto(), 
            tipo, 
            periodicidad, 
            cuenta);

        // Agregar a la cuenta
        cuenta.agregarTransaccion(transaccion);

        // Guardar
        usuarioRepository.guardar(usuario);

        return new RegistrarTransaccionResponse(
                cuenta.getIdCuenta(),
                cuenta.getSaldo());
    }
}
