import { z } from "zod";
import {
  createUserSchema,
  updateUserSchema,
} from "@/modules/users/presentation/http/validators/user-schemas";
import { UserRole } from "../../domain/value-objects/user-role";

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

// Se você quiser manter compat com nomes antigos:
export type CreateUserDto = CreateUserDTO;
export type UpdateUserDto = UpdateUserDTO;

// Tipo básico de usuário “plain”
export interface UserViewModel {
  id?: number;
  name: string;
  email: string;
  role: UserRole;
}