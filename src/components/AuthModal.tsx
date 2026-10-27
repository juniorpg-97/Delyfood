import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // <-- NUEVO
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { authService } from "../service/auth";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate(); // <-- NUEVO
  const loginStore = useAuthStore((s) => s.login);
  const [errorServidor, setErrorServidor] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  if (!isOpen) return null;

  const onLogin = async (data: LoginFormData) => {
    try {
      setErrorServidor("");
      const respuesta = await authService.login(data);

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
          setErrorServidor("El rol Delivery no tiene acceso.");
          return;
        default:
          setErrorServidor("Rol no reconocido.");
          return;
      }

      loginStore(
        respuesta.access_token,
        respuesta.usuario_id,
        respuesta.nombre_completo,
        rolString,
      );

      onClose();

      // REDIRECCIÓN AUTOMÁTICA SEGÚN EL ROL
      if (rolString === "ADMIN") {
        navigate("/admin");
      } else if (rolString === "COCINERO") {
        navigate("/cocinero");
      } else {
        navigate("/"); // El cliente se queda en la landing
      }
    } catch (err) {
      setErrorServidor("Credenciales incorrectas o error al conectar.");
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    try {
      setErrorServidor("");
      setSuccessMsg("");
      await authService.register(data);

      setSuccessMsg("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      registerForm.reset();

      setTimeout(() => {
        setActiveTab("login");
        setSuccessMsg("");
      }, 2500);
    } catch (err: any) {
      setErrorServidor(
        err.response?.data?.detail ||
          "Error al crear la cuenta. Intenta con otro correo.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-space-lg shadow-2xl flex flex-col gap-space-md relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex flex-col items-center text-center gap-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[26px]">
              restaurant_menu
            </span>
          </div>
          <h3 className="font-headline text-xl font-bold text-on-surface">
            Bienvenido a Delyfood
          </h3>
          <p className="font-body text-sm text-on-surface-variant">
            Accede a tus pedidos y reservas rápidas.
          </p>
        </div>

        <div className="flex p-1 rounded-full bg-surface-container">
          <button
            onClick={() => {
              setActiveTab("login");
              setErrorServidor("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === "login" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant"}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setErrorServidor("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === "register" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant"}`}
          >
            Crear Cuenta
          </button>
        </div>

        {errorServidor && (
          <div className="p-3 rounded-xl bg-red-100 text-red-600 text-sm text-center font-medium">
            {errorServidor}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-green-100 text-green-700 text-sm text-center font-medium">
            {successMsg}
          </div>
        )}

        {activeTab === "login" && (
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Correo Electrónico
              </label>
              <input
                {...loginForm.register("email")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="tu@correo.com"
                type="email"
              />
              {loginForm.formState.errors.email && (
                <span className="text-xs text-red-500">
                  {loginForm.formState.errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Contraseña
              </label>
              <input
                {...loginForm.register("password")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="••••••••"
                type="password"
              />
              {loginForm.formState.errors.password && (
                <span className="text-xs text-red-500">
                  {loginForm.formState.errors.password.message}
                </span>
              )}
            </div>
            <button
              disabled={loginForm.formState.isSubmitting}
              type="submit"
              className="w-full h-11 mt-2 rounded-full bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50"
            >
              {loginForm.formState.isSubmitting
                ? "Validando..."
                : "Iniciar Sesión"}
            </button>
          </form>
        )}

        {activeTab === "register" && (
          <form
            onSubmit={registerForm.handleSubmit(onRegister)}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Nombre Completo
              </label>
              <input
                {...registerForm.register("nombre_completo")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Tu nombre"
                type="text"
              />
              {registerForm.formState.errors.nombre_completo && (
                <span className="text-xs text-red-500">
                  {registerForm.formState.errors.nombre_completo.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Correo Electrónico
              </label>
              <input
                {...registerForm.register("email")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="tu@correo.com"
                type="email"
              />
              {registerForm.formState.errors.email && (
                <span className="text-xs text-red-500">
                  {registerForm.formState.errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Teléfono
              </label>
              <input
                {...registerForm.register("telefono")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="+56 9 1234 5678"
                type="tel"
              />
              {registerForm.formState.errors.telefono && (
                <span className="text-xs text-red-500">
                  {registerForm.formState.errors.telefono.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Contraseña
              </label>
              <input
                {...registerForm.register("password")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="••••••••"
                type="password"
              />
              {registerForm.formState.errors.password && (
                <span className="text-xs text-red-500">
                  {registerForm.formState.errors.password.message}
                </span>
              )}
            </div>
            <button
              disabled={registerForm.formState.isSubmitting}
              type="submit"
              className="w-full h-11 mt-2 rounded-full bg-primary text-on-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50"
            >
              {registerForm.formState.isSubmitting
                ? "Creando..."
                : "Crear Cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
