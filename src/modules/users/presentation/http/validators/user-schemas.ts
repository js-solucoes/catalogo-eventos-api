import { z } from "zod";
import { pt } from "zod/locales";
z.config(pt());

export const createUserSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Nome é obrigatório"
          : "Nome deve ser uma string",
    })
    .min(3, "Nome deve ter pelo menos 3 caracteres"),

  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Email é obrigatório"
        : "Email deve ser uma string",
  }),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Senha é obrigatória"
          : "Senha deve ser uma string",
    })
    .min(6, "Senha deve ter pelo menos 6 caracteres"),

  role: z.enum(["Admin"], {
    error: (issue) => {
      if (!["Admin"].some((element) => element === issue.input)) {
        return `A Role ${issue.input} é inválida`;
      }
    },
  }),
});

export const updateUserSchema = z.object({
  name: z
    .string({
      error: (issue) => {
        if (typeof issue.input !== "string") {
          return "Nome deve ser uma string";
        }
      },
    })
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .optional(),

  email: z
    .email({
      error: (issue) =>
        typeof issue.input === "string"
          ? "Email deve ser uma string"
          : "Email inválido",
    })
    .optional(),

  password: z
    .string({
      error: (issue) => {
        if (typeof issue.input !== "string") {
          return "Senha deve ser uma string";
        }
      },
    })
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional(),

  role: z
    .enum(["Admin"], {
      error: (issue) => {
        if (!["Admin"].some((element) => element === issue.input)) {
          return `A Role ${issue.input} é inválida`;
        }
      },
    })
    .optional(),
});
