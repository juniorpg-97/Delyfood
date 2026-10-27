import { z } from "zod";

export const registerSchema = z.object({
  nombre_completo: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
