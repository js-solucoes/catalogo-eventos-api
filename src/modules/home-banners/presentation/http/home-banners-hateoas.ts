import { Links } from "@/core/http/http-resource";

const API_ADMIN_PREFIX = "/api/admin";

export const homeBannerLinks = (id?: number): Links => ({
  self: {
    href: `${API_ADMIN_PREFIX}/home-banners/${id}`,
    method: "GET",
  },
  update: {
    href: `${API_ADMIN_PREFIX}/home-banners/${id}`,
    method: "PATCH",
  },
  delete: {
    href: `${API_ADMIN_PREFIX}/home-banners/${id}`,
    method: "DELETE",
  },
  list: {
    href: `${API_ADMIN_PREFIX}/home-banners`,
    method: "GET",
  },
});

export const homeBannersCollectionLinks = (): Links => ({
  self: {
    href: `${API_ADMIN_PREFIX}/home-banners`,
    method: "GET",
  },
  create: {
    href: `${API_ADMIN_PREFIX}/home-banners`,
    method: "POST",
  },
});
