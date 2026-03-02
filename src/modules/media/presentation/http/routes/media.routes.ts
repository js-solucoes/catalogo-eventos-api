// src/modules/media/presentation/http/routes/media.routes.ts
import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";

import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";
import {validateBody} from "@/core/http/middlewares/validate-body";

import { uploadMediaSchema } from "../validators/media-schemas";
import { UploadMediaControllerFactory } from "../controllers/factories/upload-media.controller.factory";

export function registerMediaRoutes(router: Router) {
  router.post(
    "/media",
    authMiddleware,
    authorizeRoles(["Admin"]), // ajuste se necessário
    validateBody(uploadMediaSchema),
    adaptRoute(UploadMediaControllerFactory())
  );
}