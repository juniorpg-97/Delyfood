import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Definimos las secciones del menú
const menuItems = [
  { id: "catalogo", label: "Catálogo Público", icon: "restaurant_menu" },
  { id: "pedidos", label: "Pedidos de Clientes", icon: "receipt_long" },
  { id: "cocina", label: "Operaciones de Cocina", icon: "soup_kitchen" },
  { id: "admin", label: "Administración", icon: "admin_panel_settings" },
  { id: "notificaciones", label: "Notificaciones", icon: "notifications" },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const nombre = useAuthStore((state) => state.usuarioNombre);

  // Estado para saber qué sección estamos viendo
  const [activeTab, setActiveTab] = useState("catalogo");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Función para renderizar el contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "catalogo":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-headline text-on-surface">
              Catálogo Público
            </h2>
            <p className="text-on-surface-variant">
              Gestiona los platos disponibles para los clientes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Tarjeta de ejemplo */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container">
                <div className="h-40 bg-surface-container rounded-xl mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                    image
                  </span>
                </div>
                <h3 className="font-bold text-lg text-on-surface">
                  Bowl Mediterráneo
                </h3>
                <p className="text-primary font-bold mt-1">$12.50</p>
                <button className="mt-4 w-full py-2 bg-primary text-on-primary rounded-full text-sm font-semibold hover:bg-primary-container transition-colors">
                  Editar Plato
                </button>
              </div>
            </div>
          </div>
        );
      case "pedidos":
        return (
          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface">
              Pedidos de Clientes
            </h2>
            <p className="text-on-surface-variant mb-4">
              Historial y estado de todos los pedidos.
            </p>
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 text-center text-on-surface-variant">
              Aquí irá la tabla de pedidos (Próximamente)
            </div>
          </div>
        );
      case "cocina":
        return (
          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface">
              Operaciones de Cocina
            </h2>
            <p className="text-on-surface-variant mb-4">
              Monitorea lo que están preparando los cocineros.
            </p>
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 text-center text-on-surface-variant">
              Aquí irá el tablero de la cocina (Próximamente)
            </div>
          </div>
        );
      case "admin":
        return (
          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface">
              Administración
            </h2>
            <p className="text-on-surface-variant mb-4">
              Gestión de usuarios, roles y configuración del sistema.
            </p>
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 text-center text-on-surface-variant">
              Aquí irá la gestión de usuarios (Próximamente)
            </div>
          </div>
        );
      case "notificaciones":
        return (
          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface">
              Notificaciones
            </h2>
            <p className="text-on-surface-variant mb-4">
              Alertas del sistema y nuevos pedidos.
            </p>
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-6 text-center text-on-surface-variant">
              No hay notificaciones nuevas.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* SIDEBAR (Menú Lateral) */}
      <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-surface-container flex flex-col">
        <div className="p-6 border-b border-surface-container">
          <h1 className="font-headline text-xl font-bold text-primary">
            Delyfood Admin
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">Hola, {nombre}</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-container">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
