// src/modules/media/presentation/http/validators/media-schemas.ts
import { z } from "zod";

export const verifyMediaQuerySchema = z.object({
  url: z.string().url("url deve ser uma URL http(s) válida"),
});

export type VerifyMediaQueryDTO = z.infer<typeof verifyMediaQuerySchema>;

export const uploadMediaSchema = z.object({
  file: z.object({
    base64: z.string().min(10, "base64 inválido"),
    filename: z.string().min(1, "filename é obrigatório"),
    mimeType: z.string().min(3, "mimeType é obrigatório"),
  }),
  folder: z.string().optional(),
  visibility: z.enum(["private", "public"]).optional(),
});