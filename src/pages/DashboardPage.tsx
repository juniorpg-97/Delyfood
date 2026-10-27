import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function DashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const nombre = useAuthStore((state) => state.usuarioNombre);
  const rol = useAuthStore((state) => state.usuarioRol);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Función para ir al dashboard real según el rol
  const irAlPanel = () => {
    if (rol === "ADMIN") navigate("/admin/dashboard");
    if (rol === "COCINERO") navigate("/cocinero/dashboard");
  };

  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* HEADER */}
      <header className="border-b border-surface-container bg-surface-container-lowest">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-base font-bold text-on-primary">
              D
            </span>
            <span className="text-lg font-bold tracking-tight font-headline">
              Delyfood
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="hidden sm:block text-on-surface-variant">
              {nombre} ({rol})
            </span>
            <button
              className="text-xs font-semibold text-on-surface-variant transition hover:text-primary"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO DE BIENVENIDA */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full bg-surface-container-lowest rounded-3xl p-10 shadow-sm border border-surface-container text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl">
              waving_hand
            </span>
          </div>

          <h1 className="text-4xl font-bold font-headline text-on-surface mb-3">
            ¡Bienvenido, {nombre}!
          </h1>

          <p className="text-on-surface-variant mb-8 text-lg">
            {rol === "ADMIN" &&
              "Has iniciado sesión como Administrador. Desde aquí puedes gestionar todo el restaurante."}
            {rol === "COCINERO" &&
              "Has iniciado sesión como Cocinero. Aquí verás los pedidos que debes preparar."}
            {rol === "CLIENTE" &&
              "Has iniciado sesión como Cliente. Explora nuestro menú y haz tu pedido."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={irAlPanel}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-semibold hover:bg-primary-container transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                dashboard
              </span>
              Ir al Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-surface-container text-on-surface px-8 py-3 rounded-full font-semibold hover:bg-surface-variant transition-all active:scale-95"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
