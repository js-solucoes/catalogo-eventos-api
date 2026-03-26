import { z } from "zod";
import { pt } from "zod/locales";

z.config(pt());

export const createSocialLinkSchema = z.object({
  platform: z.string().min(1, "platform é obrigatório"),
  label: z.string().min(1, "label é obrigatório"),
  url: z.url("url inválida"),
  active: z.boolean().default(true),
  order: z.number().int("order deve ser inteiro"),
});

export const updateSocialLinkSchema = z.object({
  platform: z.string().min(1, "platform é obrigatório").optional(),
  label: z.string().min(1, "label é obrigatório").optional(),
  url: z.url("url inválida").optional(),
  active: z.boolean().optional(),
  order: z.number().int("order deve ser inteiro").optional(),
});
