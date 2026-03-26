import z from "zod";
import { createHomeBannerSchema, updateHomeBannerSchema } from "../../presentation/http/validators/home-banner.schemas";

export type CreateHomeBannerDTO = z.infer<typeof createHomeBannerSchema>;
/** PATCH body only; id vem do path. */
export type UpdateHomeBannerDTO = z.infer<typeof updateHomeBannerSchema>;


