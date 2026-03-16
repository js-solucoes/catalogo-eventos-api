// src/modules/events/presentation/http/event-hateoas.ts
import { Links } from "@/core/http/http-resource";

type SortDir = "asc" | "desc";

export function eventLinks(id: string | number): Links {
  const eventId = String(id);

  return {
    self: { href: `/api/events/${eventId}`, method: "GET" },
    update: { href: `/api/events/${eventId}`, method: "PUT" },
    delete: { href: `/api/events/${eventId}`, method: "DELETE" },
    list: { href: `/api/events`, method: "GET" },
  };
}

type ListLinksParams = {
  page: number;
  limit: number;
  totalPages: number;
  // preserve filtros e sort no link
  filters?: Record<string, any>;
  sort?: { by?: string; dir?: SortDir };
};

function toQueryString(params: Record<string, any>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function eventListLinks({
  page,
  limit,
  totalPages,
  filters,
  sort,
}: ListLinksParams): Links {
  const base = "/api/events";

  const baseQuery = {
    page,
    limit,
    ...(filters ?? {}),
    sortBy: sort?.by,
    sortDir: sort?.dir,
  };

  const self = `${base}${toQueryString(baseQuery)}`;

  const next =
    page < totalPages
      ? `${base}${toQueryString({ ...baseQuery, page: page + 1 })}`
      : undefined;

  const prev =
    page > 1 ? `${base}${toQueryString({ ...baseQuery, page: page - 1 })}` : undefined;

  const first = `${base}${toQueryString({ ...baseQuery, page: 1 })}`;
  const last = `${base}${toQueryString({ ...baseQuery, page: totalPages })}`;

  return {
    self: { href: self, method: "GET" },
    first: { href: first, method: "GET" },
    last: { href: last, method: "GET" },
    ...(next ? { next: { href: next, method: "GET" } } : {}),
    ...(prev ? { prev: { href: prev, method: "GET" } } : {}),
  };
}