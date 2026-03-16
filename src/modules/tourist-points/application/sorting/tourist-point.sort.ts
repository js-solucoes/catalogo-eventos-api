// src/modules/pontos-turisticos/application/sorting/ponto-turistico.sort.ts
export const TOURIST_POINT_SORT_FIELDS = [
  "nome",
  "cidade",
  "estado",
  "createdAt",
] as const;

export type TouristPointSortField = (typeof TOURIST_POINT_SORT_FIELDS)[number];