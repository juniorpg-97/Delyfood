import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { authService } from "../service/auth";
import { useAuthStore } from "../store/useAuthStore";

export function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorServidor("");
      const respuesta = await authService.login(data);

      // 1. Traducir el rol_id numérico a un string para nuestras rutas
      let rolString = "";

      switch (respuesta.rol_id) {
        case 1:
          rolString = "ADMIN";
          break;
        case 2:
          rolString = "COCINERO";
          break;
        case 4:
          rolString = "CLIENTE";
          break;
        case 3:
          // Bloqueamos el acceso al rol Delivery
          setErrorServidor(
            "El rol Delivery no tiene acceso a esta plataforma.",
          );
          return;
        default:
          setErrorServidor("Rol no reconocido por el sistema.");
          return;
      }

      // 2. Guardar en el store
      loginStore(
        respuesta.access_token,
        respuesta.usuario_id,
        respuesta.nombre_completo,
        rolString,
      );

      // 3. Redirección basada en el Rol
      if (rolString === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (rolString === "COCINERO") {
        navigate("/cocinero", { replace: true });
      } else {
        navigate("/cliente", { replace: true });
      }
    } catch (err) {
      setErrorServidor(
        "Credenciales incorrectas o error al conectar con el servidor.",
      );
    }
  };

  return (
    // ... (Mantén el JSX visual de tu profesora)
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-slate-900 sm:px-8">
      {/* ... */}
    </main>
  );
}
