package com.fabrica.gestionfinancierapersonal.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fabrica.gestionfinancierapersonal.domain.enums.Rol;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "usuarios")
@Getter
public class Usuario {

    @Id
    private UUID idUsuario;

    private String username;
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private String telefono;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Cuenta> cuentas;

    protected Usuario() {
    }

    public Usuario(String username, String nombre, String apellido,
            String correo, String contrasena, String telefono) {

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("El Username es obligatorio");
        }

        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El Nombre es obligatorio");
        }

        if (apellido == null || apellido.isBlank()) {
            throw new IllegalArgumentException("El Apellido es obligatorio");
        }

        if (correo == null || correo.isBlank()) {
            throw new IllegalArgumentException("El Correo es obligatorio");
        }

        if (contrasena == null || contrasena.isBlank()) {
            throw new IllegalArgumentException("La Contraseña es obligatoria");
        }

        if (telefono == null || telefono.isBlank()) {
            throw new IllegalArgumentException("El Teléfono es obligatorio");
        }

        this.idUsuario = UUID.randomUUID();
        this.username = username;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.contrasena = contrasena;
        this.telefono = telefono;
        this.rol = Rol.USUARIO;
        this.cuentas = new ArrayList<>();
    }

    public void agregarCuenta(Cuenta cuenta) {
        if (cuenta == null) {
            throw new IllegalArgumentException("La cuenta no puede ser null");
        }
        boolean existe = this.cuentas.stream()
                .anyMatch(c -> c.getNombre().equalsIgnoreCase(cuenta.getNombre()));
        if (existe) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese nombre");
        }
        this.cuentas.add(cuenta);
    }

    public Cuenta buscarCuentaPorId(UUID IdCuenta) {
        if (IdCuenta == null) {
            throw new IllegalArgumentException("El id de la cuenta es obligatorio");
        }
        return this.cuentas.stream()
                .filter(c -> c.getIdCuenta().equals(IdCuenta))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada"));
    }
}
