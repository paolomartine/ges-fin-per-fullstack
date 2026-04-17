package com.fabrica.gestionfinancierapersonal.interfaces.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarTransaccionRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarTransaccionResponse;
import com.fabrica.gestionfinancierapersonal.application.usecases.RegistrarTransaccion;

@RestController
@RequestMapping("/api/transaccion")
public class TransaccionController {

    private final RegistrarTransaccion registrarTransaccion;

    public TransaccionController(RegistrarTransaccion registrarTransaccion) {
        this.registrarTransaccion = registrarTransaccion;
    }

    // Registrar transacción
    @PostMapping("/registrar")
    public ResponseEntity<RegistrarTransaccionResponse> registrar(@RequestBody RegistrarTransaccionRequest request) {
        try {
            return ResponseEntity.ok(registrarTransaccion.ejecutar(request));

        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
