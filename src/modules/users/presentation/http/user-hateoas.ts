import { Links } from "@/core/http/http-resource";

const API_PREFIX = "/api/admin";

export const userLinks = (id?: number): Links => ({
  self: {
    href: `${API_PREFIX}/users/${id}`,
    method: "GET",
  },
  update: {
    href: `${API_PREFIX}/users/${id}`,
    method: "PATCH",
  },
  delete: {
    href: `${API_PREFIX}/users/${id}`,
    method: "DELETE",
  },
  list: {
    href: `${API_PREFIX}/users`,
    method: "GET",
  },
});

export const usersCollectionLinks = (): Links => ({
  self: {
    href: `${API_PREFIX}/users`,
    method: "GET",
  },
  create: {
    href: `${API_PREFIX}/users`,
    method: "POST",
  },
});
