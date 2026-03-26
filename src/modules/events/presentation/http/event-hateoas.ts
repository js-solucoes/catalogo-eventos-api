// src/modules/events/presentation/http/event-hateoas.ts
import { Links } from "@/core/http/http-resource";

type SortDir = "asc" | "desc";
const API_ADMIN_PREFIX = "/api/admin";
const API_PUBLIC_PREFIX = "/api/public";

export function eventPublicLinks(id: string | number): Links {
  const eventId = String(id);
  return {
    self: { href: `${API_PUBLIC_PREFIX}/events/${eventId}`, method: "GET" },
    list: { href: `${API_PUBLIC_PREFIX}/events`, method: "GET" },
  };
}

export function eventLinks(id: string | number): Links {
  const eventId = String(id);

  return {
    self: { href: `${API_ADMIN_PREFIX}/events/${eventId}`, method: "GET" },
    update: { href: `${API_ADMIN_PREFIX}/events/${eventId}`, method: "PATCH" },
    delete: { href: `${API_ADMIN_PREFIX}/events/${eventId}`, method: "DELETE" },
    list: { href: `${API_ADMIN_PREFIX}/events`, method: "GET" },
  };
}

type ListLinksParams = {
  page: number;
  limit: number;
  totalPages: number;
  filters?: Record<string, string | number | boolean | undefined>;
  sort?: { by?: string; dir?: SortDir };
};

function toQueryString(params: Record<string, string | number | boolean | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

const EVENTS_ADMIN_BASE = `${API_ADMIN_PREFIX}/events`;
const EVENTS_PUBLIC_BASE = `${API_PUBLIC_PREFIX}/events`;

export function eventListLinks({
  page,
  limit,
  totalPages,
  filters,
  sort,
}: ListLinksParams): Links {
  return buildEventListLinksForBase(EVENTS_ADMIN_BASE, {
    page,
    limit,
    totalPages,
    filters,
    sort,
  });
}

export function eventPublicListLinks(params: ListLinksParams): Links {
  return buildEventListLinksForBase(EVENTS_PUBLIC_BASE, params);
}

function buildEventListLinksForBase(
  basePath: string,
  {
    page,
    limit,
    totalPages,
    filters,
    sort,
  }: ListLinksParams,
): Links {
  const baseQuery = {
    page,
    limit,
    ...(filters ?? {}),
    sortBy: sort?.by,
    sortDir: sort?.dir,
  };

  const self = `${basePath}${toQueryString(baseQuery)}`;

  const next =
    page < totalPages
      ? `${basePath}${toQueryString({ ...baseQuery, page: page + 1 })}`
      : undefined;

  const prev =
    page > 1 ? `${basePath}${toQueryString({ ...baseQuery, page: page - 1 })}` : undefined;

  const first = `${basePath}${toQueryString({ ...baseQuery, page: 1 })}`;
  const last = `${basePath}${toQueryString({ ...baseQuery, page: totalPages })}`;

  return {
    self: { href: self, method: "GET" },
    first: { href: first, method: "GET" },
    last: { href: last, method: "GET" },
    ...(next ? { next: { href: next, method: "GET" } } : {}),
    ...(prev ? { prev: { href: prev, method: "GET" } } : {}),
  };
}