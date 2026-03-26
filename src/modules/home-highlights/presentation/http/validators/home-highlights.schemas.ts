import z from "zod";
import { HOME_HIGHLIGHT_CATEGORIES } from "../../../domain/value-objects/home-highlight-categories";

export const createHomeHighlightSchema = z.object({
  type: z.enum(HOME_HIGHLIGHT_CATEGORIES, {
    error: (issue) => `Categoria ${String(issue.input)} é inválida`,
  }),
  referenceId: z.number({
    error: (issue) => {
      if (issue.code === "invalid_type" && issue.expected === "number") {
        return { message: "ReferenceId deve ser um número" };
      }
      if (issue.code === "invalid_type" && issue.expected === "undefined") {
        return { message: "ReferenceId é obrigatório" };
      }
      return { message: "ReferenceId é inválido" };
    },
  }),
  title: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "title deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "title é obrigatório" };
        }
        return { message: "title é inválido" };
      },
    })
    .min(3, "title deve ter pelo menos 3 caracteres"),
  description: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "description deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "description é obrigatório" };
        }
        return { message: "description é inválido" };
      },
    })
    .min(3, "description deve ter pelo menos 3 caracteres"),
  cityName: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "cityName deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "cityName é obrigatório" };
        }
        return { message: "cityName é inválido" };
      },
    })
    .min(3, "cityName deve ter pelo menos 3 caracteres"),
  imageUrl: z.url(),
  ctaUrl: z.url(),
  active: z.boolean().default(true),
  order: z.number().positive(),
});

export const updateHomeHighlightSchema = createHomeHighlightSchema.partial();
