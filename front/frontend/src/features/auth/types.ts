export type User = {
  id: string;
  email: string;
  username: string;
};

export type AuthSession = {
  token: string;
  user: User;
};

export type LoginCredentials = {
  correo: string;
  contrasena: string;
};

export type RegisterCredentials = {
  username: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  telefono: string;
};

export type LoginResponseDto = AuthSession;

export type RegisterResponseDto = {
  id: string;
  email: string;
};
