import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  usuarioId: number | null;
  usuarioNombre: string | null;
  usuarioRol: string | null;
  autenticado: boolean;

  login: (token: string, id: number, nombre: string, rol: string) => void;
  logout: () => void;
  esAdmin: () => boolean;
  esCocinero: () => boolean;
  esCliente: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuarioId: null,
      usuarioNombre: null,
      usuarioRol: null,
      autenticado: false,

      login: (token, id, nombre, rol) => {
        set({
          token: token,
          usuarioId: id,
          usuarioNombre: nombre,
          usuarioRol: rol,
          autenticado: true,
        });
      },

      logout: () => {
        set({
          token: null,
          usuarioId: null,
          usuarioNombre: null,
          usuarioRol: null,
          autenticado: false,
        });
      },

      esAdmin: () => get().usuarioRol === "ADMIN",
      esCocinero: () => get().usuarioRol === "COCINERO",
      esCliente: () => get().usuarioRol === "CLIENTE",
    }),
    {
      name: "solandre-auth-storage",
    },
  ),
);
