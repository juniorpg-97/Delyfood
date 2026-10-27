import { api } from "../lib/axios";
import type { MenuDia } from "../types/menu";

export const menuService = {
  getMenuSemanal: async (): Promise<MenuDia[]> => {
    try {
      // Ruta extraída de tu Swagger
      const respuesta = await api.get<MenuDia[]>("/catalogo/menu-semanal");
      return respuesta.data;
    } catch (error: any) {
      console.error(
        "Error al cargar el menú:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
