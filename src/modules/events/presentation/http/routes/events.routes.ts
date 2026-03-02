import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";
import { validateBody } from "@/core/http/middlewares/validate-body";

import { makeListEventsController } from "../factories/make-list-events.controller";
import { makeCreateEventController } from "../factories/make-create-event.controller";
import { makeUpdateEventController } from "../factories/make-update-event.controller";
import { makeDeleteEventController } from "../factories/make-delete-event.controller";

import { createEventSchema, updateEventSchema } from "../validators/event-schemas";

export function registerEventRoutes(router: Router) {
  router.get("/api/eventos", adaptRoute(makeListEventsController()));

  router.post(
    "/api/eventos",
    authMiddleware,
    authorizeRoles(["Admin"]),
    validateBody(createEventSchema),
    adaptRoute(makeCreateEventController())
  );

  router.put(
    "/api/eventos/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    validateBody(updateEventSchema),
    adaptRoute(makeUpdateEventController())
  );

  router.delete(
    "/api/eventos/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(makeDeleteEventController())
  );
}