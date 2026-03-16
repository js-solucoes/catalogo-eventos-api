import { z } from "zod";
import { id } from "zod/locales";

export const createTouristPointSchema = z.object({
  id: z.number().optional(),
  nome: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Nome deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "Nome é obrigatório" };
        }
        return { message: "Nome é inválido" };
      },
    })
    .min(3, "Nome deve ter pelo menos 3 caracteres"),

  tipo: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Tipo deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "Tipo é obrigatório" };
        }
        return { message: "Tipo é inválido" };
      },
    })
    .min(3, "Tipo deve ter pelo menos 3 caracteres"),

  horario: z
    .string({
      error: (issue) => {
        if(issue.input )
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Horário deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "Horário é obrigatório" };
        }
        return { message: "Horário é inválido" };
      },
    })
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Horário deve estar no formato HH:mm")
    .min(3, "Horário deve ter pelo menos 3 caracteres"),

  img: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Imagem deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "Imagem é obrigatória" };
        }
        return { message: "Imagem é inválida" };
      },
    })
    .min(3, "Imagem deve ter pelo menos 3 caracteres"),

  desc: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Descrição deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "Descrição é obrigatória" };
        }
        return { message: "Descrição é inválida" };
      },
    })
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),

  cityId: z.number({
    error: (issue) => {
      if (issue.code === "invalid_type" && issue.expected === "number") {
        return { message: "CidadeId deve ser um número" };
      }
      if (issue.code === "invalid_type" && issue.expected === "undefined") {
        return { message: "CidadeId é obrigatório" };
      }
      return { message: "CidadeId é inválido" };
    },
  }),
});

export const updateTouristPointSchema = z.object({
  id: z.number().optional(),
  nome: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Nome deve ser uma string" };
        }
        return { message: "Nome é inválido" };
      },
    })
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .optional(),

  tipo: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Tipo deve ser uma string" };
        }
        return { message: "Tipo é inválido" };
      },
    })
    .min(3, "Tipo deve ter pelo menos 3 caracteres")
    .optional(),

  horario: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Horário deve ser uma string" };
        }
        return { message: "Horário é inválido" };
      },
    })
    .regex(/^([0-1]?[0-2]|2[0-3]):[0-5][0-9]$/, "Horário deve estar no formato HH:mm")
    .min(3, "Horário deve ter pelo menos 3 caracteres")
    .optional(),

  img: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Imagem deve ser uma string" };
        }
        return { message: "Imagem é inválida" };
      },
    })
    .min(3, "Imagem deve ter pelo menos 3 caracteres")
    .optional(),

  desc: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Descrição deve ser uma string" };
        }
        return { message: "Descrição é inválida" };
      },
    })
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .optional(),

  cityId: z
    .number({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "number") {
          return { message: "CidadeId deve ser um número" };
        }
        return { message: "CidadeId é inválido" };
      },
    })
    .optional(),
});
