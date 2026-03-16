import { z } from "zod";
import { EVENT_CATEGORIES } from "@/modules/events/domain/value-objects/event-category";

export const createEventSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  cat: z.enum(EVENT_CATEGORIES, {
    error: (issue) => `Categoria ${String(issue.input)} é inválida`,
  }),
  data: z.string().min(4, "Data é obrigatória"),
  hora: z.string().min(3, "Hora é obrigatória"),
  local: z.string().min(3, "Local é obrigatório"),
  preco: z.string().min(1, "Preço é obrigatório"),
  img: z.url("img deve ser uma URL válida"),
  desc: z.string().min(3, "Descrição é obrigatória"),
  cityId: z.coerce.number().int().positive("cityId é obrigatório"),
});

export const updateEventSchema = createEventSchema.partial();