import { Links } from "@/core/http";

const API_PREFIX = "/api";

import { LinksPagination } from "@/core/http/hateoas/pagination-links";

export function touristPointLinks(id: number): LinksPagination {
  return {
    self: { href: `${API_PREFIX}/pontos-turisticos/${id}`, method: "GET" },
    update: { href: `${API_PREFIX}/pontos-turisticos/${id}`, method: "PUT" },
    delete: { href: `${API_PREFIX}/pontos-turisticos/${id}`, method: "DELETE" },
    list: { href: `${API_PREFIX}/pontos-turisticos`, method: "GET" },
    create: { href: `${API_PREFIX}/pontos-turisticos`, method: "POST" },
  };
}

export const touristPointsCollectionLinks = (): Links => ({
  self: {
    href: `${API_PREFIX}/pontos-turisticos`,
    method: "GET",
  },
  create: {
    href: `${API_PREFIX}/pontos-turisticos`,
    method: "POST",
  },
});
