package com.fabrica.gestionfinancierapersonal.interfaces.controllers;

import com.fabrica.gestionfinancierapersonal.application.usecases.LoginUsuario;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fabrica.gestionfinancierapersonal.application.dtos.LoginUsuarioRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.LoginUsuarioResponse;
import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarUsuarioRequest;
import com.fabrica.gestionfinancierapersonal.application.dtos.RegistrarUsuarioResponse;
import com.fabrica.gestionfinancierapersonal.application.usecases.RegistrarUsuario;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final LoginUsuario loginUsuario;
    private final RegistrarUsuario registrarUsuario;

    public UsuarioController(RegistrarUsuario registrarUsuario, LoginUsuario loginUsuario) {
        this.registrarUsuario = registrarUsuario;
        this.loginUsuario = loginUsuario;
    }

    // Registrar usuario
    @PostMapping("/signup")
    public RegistrarUsuarioResponse registrar(@RequestBody RegistrarUsuarioRequest request) {
        try {
            return registrarUsuario.ejecutar(request);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // Login usuario
    @PostMapping("/login")
    public LoginUsuarioResponse login(@RequestBody LoginUsuarioRequest request) {
        try {
            return loginUsuario.ejecutar(request);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
