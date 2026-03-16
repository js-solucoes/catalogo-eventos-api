import { EventCategory } from "../../domain/value-objects/event-category";

export type CreateEventDTO = {
  titulo: string;
  cat: EventCategory;
  data: string;
  hora: string;
  local: string;
  preco: string;
  img: string;
  desc: string;
  cityId: number;
};

export type UpdateEventDTO = Partial<CreateEventDTO>;

export type ListEventsDTO = {
  page?: number | string;
  limit?: number | string;

  titulo?: string;
  cat?: EventCategory;
  cityId?: number | string;

  sortBy?: string;
  sortDir?: "asc" | "desc" | string;
};

export type ListEventsResult = {
  items: Array<{
    id: number;
    titulo: string;
    cat: EventCategory;
    data: string;
    hora: string;
    local: string;
    preco: string;
    img: string;
    desc: string;
    cityId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sort?: { by: string; dir: "asc" | "desc" };
};