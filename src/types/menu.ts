// src/types/menu.ts
export interface Plato {
  plato_id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
}

export interface MenuDia {
  menu_dia_id: number;
  fecha: string;
  precio_menu: string;
  cantidad_disponible: number;
  publicado: boolean;
  info_nutricional: string | null;
  imagen_url: string;
  plato_principal: Plato;
  bebida: Plato;
  postre: Plato;
}
