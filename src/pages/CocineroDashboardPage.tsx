import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function CocineroDashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const nombre = useAuthStore((state) => state.usuarioNombre);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* HEADER DE COCINA */}
      <header className="bg-surface-container-lowest border-b border-surface-container shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">
              soup_kitchen
            </span>
            <div>
              <h1 className="font-headline text-xl font-bold text-on-surface">
                Cocina Delyfood
              </h1>
              <p className="text-xs text-on-surface-variant">Hola, {nombre}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Operaciones de Cocina
          </h2>
          <p className="text-on-surface-variant">
            Aquí verás los pedidos que debes preparar.
          </p>
        </div>

        {/* Tablero de Pedidos (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de ejemplo de un pedido */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-surface-container pb-3">
              <span className="font-bold text-on-surface">Pedido #1042</span>
              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                Pendiente
              </span>
            </div>
            <ul className="text-sm text-on-surface-variant flex flex-col gap-2">
              <li className="flex justify-between">
                <span>2x Bowl Mediterráneo</span>
                <span className="font-bold">x2</span>
              </li>
              <li className="flex justify-between">
                <span>1x Pasta al Pesto</span>
                <span className="font-bold">x1</span>
              </li>
            </ul>
            <button className="mt-4 w-full py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors">
              Marcar como Listo
            </button>
          </div>

          {/* Tarjeta vacía para mostrar el estado */}
          <div className="bg-surface-container-low rounded-2xl border-2 border-dashed border-surface-container flex items-center justify-center p-5 h-64">
            <p className="text-on-surface-variant text-sm text-center">
              No hay más pedidos pendientes por ahora.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
