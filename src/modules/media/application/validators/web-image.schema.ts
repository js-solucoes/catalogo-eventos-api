import { z } from "zod";
import type { WebImagePayload } from "../../domain/value-objects/web-image-payload";

/** Payload de imagem em base64 (data URL ou só o payload) enviado pelos módulos ao criar/atualizar entidades. */
export const webImageFileSchema = z.object({
  base64: z.string().min(20, "imagem em base64 inválida ou muito curta"),
  mimeType: z
    .string()
    .regex(
      /^image\/(jpeg|jpg|png|webp|gif)$/i,
      "mimeType deve ser imagem (jpeg, png, webp ou gif)",
    ),
  filename: z.string().min(1).optional(),
}) satisfies z.ZodType<WebImagePayload>;

export type WebImageFileInput = WebImagePayload;
