import adaptRoute from "@/core/adapters/express-route-adapter";
import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";
import { validateBody } from "@/core/http/middlewares/validate-body";
import {
  makeCreateHomeBannerController,
  makeDeleteHomeBannerController,
  makeFindHomeBannerByIdController,
  makeGetHomeBannerController,
  makeUpdateHomeBannerController,
} from "../factories";
import { Router } from "express";
import {
  createHomeBannerSchema,
  updateHomeBannerSchema,
} from "../validators/home-banner.schemas";

export function registerHomeBannerRoutes(router: Router) {
  router.post(
    `/admin/home-banners`,
    authMiddleware,
    authorizeRoles(["Admin"]),
    validateBody(createHomeBannerSchema),
    adaptRoute(makeCreateHomeBannerController()),
  );
  router.get(
    `/admin/home-banners`,
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeGetHomeBannerController()),
  );
  router.get(
    `/admin/home-banners/:id`,
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeFindHomeBannerByIdController()),
  );
  router.patch(
    `/admin/home-banners/:id`,
    authMiddleware,
    authorizeRoles(["Admin"]),
    validateBody(updateHomeBannerSchema),
    adaptRoute(makeUpdateHomeBannerController()),
  );
  router.delete(
    `/admin/home-banners/:id`,
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeDeleteHomeBannerController()),
  );
}
