import { z } from "zod";

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * CTA do site: URL absoluta (https://...) ou caminho de SPA (`/eventos`, `/cidades/1`).
 */
export const ctaUrlSchema = z
  .string()
  .min(1, "ctaUrl é obrigatório")
  .refine(
    (v) => v.startsWith("/") || isAbsoluteHttpUrl(v),
    "ctaUrl deve ser URL http(s) ou caminho começando com / (ex.: /eventos, /pontos-turisticos)",
  );
