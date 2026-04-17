import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "@/lib/validation";
import type { LoginFormData } from "@/lib/validation";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm() {
  const { login: loginHook, isLoading, error } = useLogin();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const session = await loginHook(data);
      authLogin(session);
      navigate("/");
    } catch {
      // error manejado en el hook
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" placeholder="Correo" {...register("correo")} />
        {errors.correo && (
          <p style={{ color: "red", margin: "4px 0" }}>
            {errors.correo.message}
          </p>
        )}

        <input
          type="password"
          placeholder="Contraseña"
          {...register("contrasena")}
        />
        {errors.contrasena && (
          <p style={{ color: "red", margin: "4px 0" }}>
            {errors.contrasena.message}
          </p>
        )}

        <button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="link">
          Registrate
        </Link>
      </p>
    </div>
  );
}
