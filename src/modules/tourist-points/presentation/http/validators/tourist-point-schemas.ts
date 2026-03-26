import { TOURIST_POINT_CATEGORIES } from "@/modules/tourist-points/domain/value-objects/tourist-point-category";
import { z } from "zod";
import { id } from "zod/locales";

export const createTouristPointSchema = z.object({
  id: z.number().optional(),
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
  citySlug: z.string(),
  name: z
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
  description: z.string(),
  category: z
    .enum(TOURIST_POINT_CATEGORIES,{
    error: (issue) => `Categoria ${String(issue.input)} é inválida`,
  }),
  address: z.string(),
  openingHours: z
    .string({
      error: (issue) => {
        if (issue.input)
          if (issue.code === "invalid_type" && issue.expected === "string") {
            return { message: "Horário deve ser uma string" };
          }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "Horário é obrigatório" };
        }
        return { message: "Horário é inválido" };
      },
    })
    .regex(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Horário deve estar no formato HH:mm",
    )
    .min(3, "Horário deve ter pelo menos 3 caracteres"),

  imageUrl: z
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

  featured: z.boolean(),

  published: z.boolean(),
});

export const updateTouristPointSchema = z.object({
  cityId: z
    .number({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "number") {
          return { message: "CidadeId deve ser um número" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "CidadeId é obrigatório" };
        }
        return { message: "CidadeId é inválido" };
      },
    })
    .optional(),
  citySlug: z.string().optional(),
  name: z
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
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .optional(),
  description: z.string().optional(),
  category: z
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
    .min(3, "Tipo deve ter pelo menos 3 caracteres")
    .optional(),
  address: z.string().optional(),
  openingHours: z
    .string({
      error: (issue) => {
        if (issue.input)
          if (issue.code === "invalid_type" && issue.expected === "string") {
            return { message: "Horário deve ser uma string" };
          }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "Horário é obrigatório" };
        }
        return { message: "Horário é inválido" };
      },
    })
    .regex(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Horário deve estar no formato HH:mm",
    )
    .min(3, "Horário deve ter pelo menos 3 caracteres")
    .optional(),

  imageUrl: z
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
    .min(3, "Imagem deve ter pelo menos 3 caracteres")
    .optional(),

  featured: z.boolean().optional(),

  published: z.boolean().optional(),
});
