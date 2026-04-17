import { z } from 'zod';

export const emailSchema = z.string().email('El formato del correo no es válido');

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
  .regex(/\d/, 'Debe incluir al menos un número')
  .regex(/[@$!%*#?&]/, 'Debe incluir al menos un carácter especial (@$!%*#?&)');

export const loginSchema = z.object({
  correo: emailSchema,
  contrasena: z.string().min(1, 'La contraseña es obligatoria'),
});

export const registerSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  correo: emailSchema,
  contrasena: passwordSchema,
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
