package com.fabrica.gestionfinancierapersonal.interfaces.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.fabrica.gestionfinancierapersonal.application.dtos.CrearCuentaRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.CrearCuentaResponse;
import com.fabrica.gestionfinancierapersonal.application.usecases.CrearCuenta;

@RestController
@RequestMapping("/api/cuentas")
public class CuentaController {

    private final CrearCuenta crearCuentaUseCase;

    public CuentaController(CrearCuenta crearCuentaUseCase) {
        this.crearCuentaUseCase = crearCuentaUseCase;
    }

    // Crear cuenta 
    @PostMapping("/crear")
    public ResponseEntity<CrearCuentaResponse> crearCuenta(@RequestBody CrearCuentaRequest request) {

        try {
            return ResponseEntity.ok(crearCuentaUseCase.ejecutar(request));

        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}