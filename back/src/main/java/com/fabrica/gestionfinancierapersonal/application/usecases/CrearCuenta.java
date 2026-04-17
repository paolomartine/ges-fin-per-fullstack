package com.fabrica.gestionfinancierapersonal.application.usecases;

import org.springframework.stereotype.Service;

import com.fabrica.gestionfinancierapersonal.application.dtos.CrearCuentaRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.CrearCuentaResponse;
import com.fabrica.gestionfinancierapersonal.application.repository.UsuarioRepository;
import com.fabrica.gestionfinancierapersonal.domain.enums.Moneda;
import com.fabrica.gestionfinancierapersonal.domain.enums.TipoCuenta;
import com.fabrica.gestionfinancierapersonal.domain.model.Cuenta;
import com.fabrica.gestionfinancierapersonal.domain.model.Usuario;

@Service
public class CrearCuenta {

    private final UsuarioRepository usuarioRepository;

    public CrearCuenta(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public CrearCuentaResponse ejecutar(CrearCuentaRequest request) {

        // Validaciones
        if (request.idUsuario() == null) {
            throw new IllegalArgumentException("El id del usuario es obligatorio");
        }

        if (request.tipo() == null) {
            throw new IllegalArgumentException("El tipo es obligatorio");
        }

        if (request.saldoInicial() < 0) {
            throw new IllegalArgumentException("El saldo inicial debe ser cero o positivo");
        }

        if (request.moneda() == null) {
            throw new IllegalArgumentException("La moneda es obligatoria");
        }

        // Convertir STRING → ENUM
        Moneda moneda;
        try {
            moneda = Moneda.valueOf(request.moneda().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Moneda inválida");
        }

        TipoCuenta tipo;
        try {
            tipo = TipoCuenta.valueOf(request.tipo().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Tipo de cuenta inválido");
        }

        
        if (tipo == TipoCuenta.BANCARIA &&
                (request.nombre() == null || request.nombre().isBlank())) {
            throw new IllegalArgumentException("El nombre es obligatorio para cuentas bancarias");
        }


        // Buscar usuario
        Usuario usuario = usuarioRepository.buscarPorId(request.idUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (tipo == TipoCuenta.EFECTIVO) {
            boolean yaTieneEfectivo = usuario.getCuentas().stream()
                    .anyMatch(c -> c.getTipo() == TipoCuenta.EFECTIVO);

            if (yaTieneEfectivo) {
                throw new IllegalArgumentException("El usuario ya tiene una cuenta de efectivo");
            }
        }


        // Crear cuenta
        Cuenta cuenta = new Cuenta(
                request.nombre(), 
                tipo,
                moneda, 
                usuario);

        if (request.saldoInicial() > 0) {
            cuenta.registrarSaldoInicial(request.saldoInicial());
        }

        // Agregar al usuario
        usuario.agregarCuenta(cuenta);

        // Guardar
        usuarioRepository.guardar(usuario);

        return new CrearCuentaResponse(
                cuenta.getIdCuenta(),
                cuenta.getNombre(),
                cuenta.getTipo(),
                cuenta.getSaldo(),
                cuenta.getMoneda());
    }
}