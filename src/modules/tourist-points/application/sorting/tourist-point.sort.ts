export const TOURIST_POINT_SORT_FIELDS = [
  "nome",
  "city",
  "estado",
  "createdAt",
] as const;

export type TouristPointSortField = (typeof TOURIST_POINT_SORT_FIELDS)[number];