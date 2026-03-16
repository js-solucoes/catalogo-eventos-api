import { Links } from "@/core/http/http-resource";

const API_PREFIX = "/api";

export const cityLinks = (id?: number): Links => ({
  self: {
    href: `${API_PREFIX}/cities/${id}`,
    method: "GET",
  },
  update: {
    href: `${API_PREFIX}/cities/${id}`,
    method: "PUT",
  },
  delete: {
    href: `${API_PREFIX}/cities/${id}`,
    method: "DELETE",
  },
  list: {
    href: `${API_PREFIX}/cities`,
    method: "GET",
  },
});

export const cidadesCollectionLinks = (): Links => ({
  self: {
    href: `${API_PREFIX}/cities`,
    method: "GET",
  },
  create: {
    href: `${API_PREFIX}/cities`,
    method: "POST",
  },
});