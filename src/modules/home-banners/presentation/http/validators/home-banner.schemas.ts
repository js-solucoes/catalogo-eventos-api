import { ctaUrlSchema } from "@/core/http/validators/cta-url.schema";
import { webImageFileSchema } from "@/modules/media/application/validators/web-image.schema";
import { z } from "zod";

export const createHomeBannerSchema = z.object({
  title: z
    .string("Titulo é obrigatório.")
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  subtitle: z
    .string("Subtitulo é obrigatório.")
    .min(3, "Subtitulo deve ter pelo menos 3 caracteres"),
  image: webImageFileSchema,
  ctaLabel: z.string("ctaLabel é obrigatório."),
  ctaUrl: ctaUrlSchema,
  active: z.boolean().default(true),
  order: z.number(),
});

export const updateHomeBannerSchema = createHomeBannerSchema.partial();
