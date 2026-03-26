import adaptRoute from "@/core/adapters/express-route-adapter";
import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";
import { Router } from "express-serve-static-core";
import {
  makeCreateCityController,
  makeDeleteCityController,
  makeFindCityByIdController,
  makeFindCityBySlugController,
  makeListCityController,
  makePublicListCityController,
  makeUpdateCityController,
} from "../factories";

export function registerCityRoutes(router: Router): void {
  router.get(
    "/admin/cities",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeListCityController()),
  );
  router.get(
    "/admin/cities/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeFindCityByIdController("admin")),
  );
  router.post(
    "/admin/cities",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeCreateCityController()),
  );
  router.patch(
    "/admin/cities/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeUpdateCityController()),
  );
  router.delete(
    "/admin/cities/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeDeleteCityController()),
  );

  router.get(
    "/public/cities/by-id/:id",
    adaptRoute(makeFindCityByIdController("public")),
  );
  router.get("/public/cities", adaptRoute(makePublicListCityController()));
  router.get(
    "/public/cities/:slug",
    adaptRoute(makeFindCityBySlugController()),
  );
}
