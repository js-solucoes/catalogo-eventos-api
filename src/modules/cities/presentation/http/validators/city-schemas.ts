import z from "zod";

export const createCitySchema = z.object({
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

  uf: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "UF deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "UF é obrigatório" };
        }
        return { message: "UF é inválida" };
      },
    })
    .length(2, "UF deve ter exatamente 2 caracteres"),

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
});

export const updateCitySchema = z.object({
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

  uf: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "UF deve ser uma string" };
        }
        return { message: "UF é inválida" };
      },
    })
    .length(2, "UF deve ter exatamente 2 caracteres")
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
});

export const getCityParamsSchema = z.object({
  id: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "ID deve ser uma string" };
        }
        if (issue.code === "invalid_type" && issue.expected === "undefined") {
          return { message: "ID é obrigatório" };
        }
        return { message: "ID é inválido" };
      },
    })
    .regex(/^\d+$/, "ID deve ser um número inteiro representado como string"),
});

export const deleteCityParamsSchema = getCityParamsSchema;

export const listCitiesQuerySchema = z.object({
  page: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Page deve ser uma string" };
        }
        return { message: "Page é inválida" };
      },
    })
    .regex(/^\d+$/, "Page deve ser um número inteiro representado como string")
    .optional(),

  limit: z
    .string({
      error: (issue) => {
        if (issue.code === "invalid_type" && issue.expected === "string") {
          return { message: "Limit deve ser uma string" };
        }
        return { message: "Limit é inválido" };
      },
    })
    .regex(/^\d+$/, "Limit deve ser um número inteiro representado como string")
    .optional(),
});