import adaptRoute from "@/core/adapters/express-route-adapter";
import { Router } from "express";

import { LoginController } from "../controllers/login.controller";
import { RefreshTokenController } from "../controllers/refresh-token.controller";

import { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase";
import { RefreshTokenUseCase } from "@/modules/auth/application/use-cases/refresh-token.usecase";

import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { JwtAuthTokenService } from "@/modules/auth/infra/jwt-auth-token.service";

import { logger } from "@/core/config/logger";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";

import { validateBody } from "@/core/http/middlewares/validate-body";
import { loginSchema, refreshTokenSchema } from "../validators/auth-schemas";

export function registerAuthRoutes(router: Router): void {
  const userRepo = new SequelizeUserRepository();
  const tokenService = new JwtAuthTokenService();
  const encrypter = new BcryptAdapter(12);

  const loginUseCase = new LoginUseCase(userRepo, encrypter, tokenService, logger);

  // ✅ AGORA o refresh precisa do repo pra pegar email/role
  const refreshUseCase = new RefreshTokenUseCase(tokenService, userRepo, logger);

  const loginController = new LoginController(loginUseCase);
  const refreshController = new RefreshTokenController(refreshUseCase);

  router.post("/auth/login", validateBody(loginSchema), adaptRoute(loginController));
  router.post(
    "/auth/refresh-token",
    validateBody(refreshTokenSchema),
    adaptRoute(refreshController)
  );
}
