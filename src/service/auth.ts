import { api } from "../lib/axios";
import type { LoginFormData } from "../schemas/loginSchema";
import type { RegisterFormData } from "../schemas/registerSchema";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  usuario_id: number;
  rol_id: number;
  nombre_completo: string;
  email: string;
}

export const authService = {
  login: async (datos: LoginFormData): Promise<TokenResponse> => {
    const respuesta = await api.post<TokenResponse>("/auth/login", datos);
    return respuesta.data;
  },

  register: async (datos: RegisterFormData): Promise<any> => {
    const respuesta = await api.post("/auth/register", datos);
    return respuesta.data;
  },
};
