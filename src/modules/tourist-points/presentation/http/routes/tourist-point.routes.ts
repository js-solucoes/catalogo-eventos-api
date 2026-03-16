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
    "/pontos-turisticos",
    validateBody(createTouristPointSchema),
    adaptRoute(makeCreateTouristPointController()),
  );
  router.get(
    "/pontos-turisticos",
    adaptRoute(makeListTouristPointsController()),
  );
  router.get(
    "/pontos-turisticos/:id",
    adaptRoute(makeGetTouristPointByIdController()),
  );
  router.put(
    "/pontos-turisticos/:id",
    validateBody(updateTouristPointSchema),
    adaptRoute(makeUpdateTouristPointController()),
  );
  router.delete(
    "/pontos-turisticos/:id",
    authMiddleware,
    adaptRoute(makeDeleteTouristPointController()),
  );
}
