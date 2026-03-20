import adaptRoute from "@/core/adapters/express-route-adapter";
import { validateBody } from "@/core/http/middlewares/validate-body";
import { Router } from "express";

import {
  makeCreateTouristPointController,
  makeDeleteTouristPointController,
  makeGetTouristPointByIdController,
  makeListTouristPointsController,
  makeUpdateTouristPointController,
} from "../factories/tourist-point-controllers.factory";

import { authMiddleware } from "@/core/http/middlewares";
import {
  createTouristPointSchema,
  updateTouristPointSchema,
} from "../validators/tourist-point-schemas";

export function registerTouristPointsRoutes(router: Router) {
  router.post(
    "/admin/tourist-points",
    validateBody(createTouristPointSchema),
    adaptRoute(makeCreateTouristPointController()),
  );
  router.get(
    "/admin/tourist-points",
    adaptRoute(makeListTouristPointsController()),
  );
  router.get(
    "/admin/tourist-points/:id",
    adaptRoute(makeGetTouristPointByIdController()),
  );
  router.put(
    "/admin/tourist-points/:id",
    validateBody(updateTouristPointSchema),
    adaptRoute(makeUpdateTouristPointController()),
  );
  router.delete(
    "/admin/tourist-points/:id",
    authMiddleware,
    adaptRoute(makeDeleteTouristPointController()),
  );
}
