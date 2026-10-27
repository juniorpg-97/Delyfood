import "./App.css";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { CocineroDashboardPage } from "./pages/CocineroDashboardPage";

function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const autenticado = useAuthStore((state) => state.autenticado);
  const token = useAuthStore((state) => state.token);
  const rol = useAuthStore((state) => state.usuarioRol);

  const [rehidratado, setRehidratado] = useState(
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() =>
      setRehidratado(true),
    );
    return unsubscribe;
  }, []);

  if (!rehidratado) return null;
  if (!autenticado || !token) return <Navigate to="/" replace />;
  if (rol && !allowedRoles.includes(rol.toUpperCase()))
    return <Navigate to="/" replace />;

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Rutas del ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<DashboardPage />} />{" "}
        {/* Pantalla de Bienvenida */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />{" "}
        {/* Panel Real */}
      </Route>

      {/* Rutas del COCINERO */}
      <Route element={<ProtectedRoute allowedRoles={["COCINERO"]} />}>
        <Route path="/cocinero" element={<DashboardPage />} />{" "}
        {/* Pantalla de Bienvenida */}
        <Route
          path="/cocinero/dashboard"
          element={<CocineroDashboardPage />}
        />{" "}
        {/* Panel Real */}
      </Route>

      {/* Rutas del CLIENTE */}
      <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
        <Route path="/cliente" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
