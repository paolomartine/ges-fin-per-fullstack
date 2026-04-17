import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema } from '@/lib/validation';
import type { RegisterFormData } from '@/lib/validation';
import { useRegister } from '@/features/auth/hooks/useRegister';

export function RegisterForm() {
  const { register: registerHook, isLoading, error } = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerHook(data);
      navigate('/login');
    } catch {
      // error manejado en el hook
    }
  };

  return (
    <div className="container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Nombre de usuario" {...register('username')} />
        {errors.username && <p style={{ color: 'red', margin: '4px 0' }}>{errors.username.message}</p>}

        <input placeholder="Nombre" {...register('nombre')} />
        {errors.nombre && <p style={{ color: 'red', margin: '4px 0' }}>{errors.nombre.message}</p>}

        <input placeholder="Apellido" {...register('apellido')} />
        {errors.apellido && <p style={{ color: 'red', margin: '4px 0' }}>{errors.apellido.message}</p>}

        <input type="email" placeholder="Correo" {...register('correo')} />
        {errors.correo && <p style={{ color: 'red', margin: '4px 0' }}>{errors.correo.message}</p>}

        <input type="password" placeholder="Contraseña" {...register('contrasena')} />
        {errors.contrasena && <p style={{ color: 'red', margin: '4px 0' }}>{errors.contrasena.message}</p>}

        <input placeholder="Teléfono" {...register('telefono')} />
        {errors.telefono && <p style={{ color: 'red', margin: '4px 0' }}>{errors.telefono.message}</p>}

        <button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="link">Iniciá sesión</Link>
      </p>
    </div>
  );
}
