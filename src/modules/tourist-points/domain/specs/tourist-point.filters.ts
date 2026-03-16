// src/modules/pontos-turisticos/domain/specs/ponto-turistico.filters.ts
import { Specification } from "@/core/domain/specification/specification";
import { eq, like } from "@/core/domain/specification/builders";

export type ListPontosParams = {
  search?: string;
  cidade?: string;
  estado?: string;
  categoria?: string;
};

const normalize = (v?: string) => (v?.trim() ? v.trim() : undefined);

export const bySearch = (p: ListPontosParams): Specification | null => {
  const v = normalize(p.search);
  return v ? like("nome", v) : null;
};

export const byCidade = (p: ListPontosParams): Specification | null => {
  const v = normalize(p.cidade);
  return v ? eq("cidade", v) : null;
};

export const byEstado = (p: ListPontosParams): Specification | null => {
  const v = normalize(p.estado);
  return v ? eq("estado", v) : null;
};

export const byCategoria = (p: ListPontosParams): Specification | null => {
  const v = normalize(p.categoria);
  return v ? eq("categoria", v) : null;
};