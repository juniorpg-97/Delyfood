import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "../components/AuthModal";
import { useAuthStore } from "../store/useAuthStore";
import { menuService } from "../service/menu";
import type { MenuDia } from "../types/menu";

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();

  const [menus, setMenus] = useState<MenuDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const { autenticado, usuarioNombre, usuarioRol, logout } = useAuthStore();

  useEffect(() => {
    const cargarMenu = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await menuService.getMenuSemanal();
        setMenus(data);
      } catch (err: any) {
        const mensajeError =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "No se pudo cargar el menú. Intenta más tarde.";
        setError(mensajeError);
      } finally {
        setLoading(false);
      }
    };
    cargarMenu();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const irAlDashboard = () => {
    if (usuarioRol === "ADMIN") navigate("/admin/dashboard");
    if (usuarioRol === "COCINERO") navigate("/cocinero/dashboard");
  };

  const handleAddToOrder = (name: string, price: string) => {
    setToastMsg(`Agregado: ${name} ($${price})`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + "T00:00:00");
    const dias = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return dias[fecha.getDay()];
  };

  return (
    <div className="bg-surface text-on-surface flex flex-col min-h-screen font-body">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-headline text-xl font-bold text-primary tracking-tight">
            Delyfood
          </div>

          <div className="hidden md:flex gap-6 text-sm font-semibold text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">
              Inicio
            </a>
            <a
              href="#menu-semanal"
              className="hover:text-primary transition-colors"
            >
              Menú
            </a>
            <a
              href="#nosotros"
              className="hover:text-primary transition-colors"
            >
              Sobre Nosotros
            </a>
            <a
              href="#contacto"
              className="hover:text-primary transition-colors"
            >
              Contacto
            </a>
          </div>

          <div className="flex items-center gap-3">
            {autenticado ? (
              <>
                <span className="text-sm font-semibold text-on-surface-variant hidden sm:block">
                  Hola, {usuarioNombre}
                </span>
                {(usuarioRol === "ADMIN" || usuarioRol === "COCINERO") && (
                  <button
                    onClick={irAlDashboard}
                    className="h-10 px-5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="h-10 px-4 rounded-full bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-variant transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="h-10 px-5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mt-16">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Almuerzos Saludables
          </h1>
          <p className="font-headline text-xl md:text-2xl text-white mb-3">
            Directo a tu puerta
          </p>
          <p className="font-body text-white/80 mb-8 max-w-lg">
            Ofrecemos almuerzos nutritivos con ingredientes frescos y de
            calidad, preparados diariamente.
          </p>
          <div className="flex gap-4">
            <a
              href="#menu-semanal"
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-semibold hover:bg-primary-container transition-all shadow-md"
            >
              Ver Menú
            </a>
            <a
              href="#contacto"
              className="bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-md"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </header>

      {/* MENÚ SEMANAL */}
      <section
        id="menu-semanal"
        className="py-16 px-4 max-w-7xl mx-auto w-full"
      >
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
            Menú Semanal
          </h2>
          <p className="font-body text-on-surface-variant">
            Descubre nuestro delicioso menú de la semana
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              progress_activity
            </span>
          </div>
        )}

        {error && (
          <div className="text-center py-10 px-4 bg-red-50 rounded-2xl border border-red-200 text-red-600">
            <p className="font-semibold mb-2">Error al cargar el menú</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {menus.map((menu) => (
              <div
                key={menu.menu_dia_id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Cabecera con el Día */}
                <div className="p-3 text-center font-semibold text-sm bg-primary-fixed text-on-primary-fixed">
                  {formatearFecha(menu.fecha)}
                </div>

                {/* Imagen del plato */}
                <div className="relative h-40 bg-surface-container">
                  {menu.imagen_url ? (
                    <img
                      src={menu.imagen_url}
                      alt={menu.plato_principal.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                        image
                      </span>
                    </div>
                  )}
                  {/* Precio */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface text-xs font-bold">
                    ${menu.precio_menu}
                  </div>
                  {/* Cantidad disponible */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                    {menu.cantidad_disponible > 0
                      ? `Quedan ${menu.cantidad_disponible}`
                      : "Agotado"}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-headline font-bold text-on-surface text-base mb-1 leading-tight">
                    {menu.plato_principal.nombre}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                    {menu.plato_principal.descripcion || "Sin descripción"}
                  </p>

                  {/* Info nutricional */}
                  {menu.info_nutricional && (
                    <p className="text-[10px] text-primary font-semibold mb-2">
                      Info: {menu.info_nutricional}
                    </p>
                  )}

                  {/* Bebida y Postre con descripciones */}
                  <div className="mt-auto flex flex-col gap-1.5 text-xs text-on-surface-variant border-t border-surface-container pt-2">
                    <div className="flex items-start gap-1">
                      <span className="material-symbols-outlined text-[14px] mt-0.5">
                        local_cafe
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">
                          {menu.bebida.nombre}
                        </p>
                        {menu.bebida.descripcion && (
                          <p className="text-[10px] leading-tight">
                            {menu.bebida.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="material-symbols-outlined text-[14px] mt-0.5">
                        cake
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">
                          {menu.postre.nombre}
                        </p>
                        {menu.postre.descripcion && (
                          <p className="text-[10px] leading-tight">
                            {menu.postre.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de Agregar */}
                <div className="p-3 pt-0">
                  <button
                    onClick={() =>
                      handleAddToOrder(
                        menu.plato_principal.nombre,
                        menu.precio_menu,
                      )
                    }
                    disabled={menu.cantidad_disponible === 0}
                    className="w-full py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                    {menu.cantidad_disponible === 0 ? "Agotado" : "Agregar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SOBRE NOSOTROS */}
      <section
        id="nosotros"
        className="py-16 px-4 bg-surface-container-low w-full"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">
              Sobre Nosotros
            </h2>
            <p className="font-body text-on-surface-variant mb-4 leading-relaxed">
              En Delyfood honramos la tradición de la cocina casera honesta:
              cosechas de temporada, equilibrio nutricional supervisado y sabor
              reconfortante para nutrir tus jornadas sin complicaciones.
            </p>
            <p className="font-body text-on-surface-variant leading-relaxed">
              Nuestro equipo de chefs trabaja cada mañana para seleccionar los
              mejores ingredientes locales y preparar platos que te hagan sentir
              en casa.
            </p>
          </div>
          <div className="flex-1 w-full">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Nuestro equipo de cocina"
              className="rounded-3xl shadow-lg w-full object-cover h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contacto"
        className="w-full bg-surface-container px-4 pt-12 pb-8 flex flex-col items-center gap-6 mt-auto"
      >
        <div className="text-center">
          <span className="font-headline text-xl font-bold text-on-surface block mb-2">
            Delyfood
          </span>
          <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto">
            Sabor artesanal, ingredientes frescos y cocina de temporada directo
            a tu mesa.
          </p>
        </div>
        <div className="text-xs text-on-surface-variant/70 text-center">
          <p>© 2025 Delyfood Restaurante. Todos los derechos reservados.</p>
        </div>
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-20 left-4 right-4 z-50 p-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
              check_circle
            </span>
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
