import adaptRoute from "@/core/adapters/express-route-adapter";
import { Router } from "express";

import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";
import { validateBody } from "@/core/http/middlewares/validate-body";

import { createUserSchema, updateUserSchema } from "../validators/user-schemas";

import { CreateUserController } from "../controllers/create-user.controller";
import { DeleteUserController } from "../controllers/delete-user.controller";
import { GetUserByIdController } from "../controllers/get-user-by-id.controller";
import { ListUsersController } from "../controllers/list-users.controller";
import { UpdateUserController } from "../controllers/update-user.controller";

import { CreateUserUseCase } from "@/modules/users/application/use-cases/create-user.usecase";
import { DeleteUserUseCase } from "@/modules/users/application/use-cases/delete-user.usecase";
import { GetUserByIdUseCase } from "@/modules/users/application/use-cases/get-user-by-id.usecase";
import { ListUsersUseCase } from "@/modules/users/application/use-cases/list-users.usecase";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/update-user.usecase";

import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";

import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";

export function registerUserRoutes(router: Router): void {
  const userRepo = new SequelizeUserRepository();
  const encrypter = new BcryptAdapter(12);

  const createUserUseCase = new CreateUserUseCase(
    userRepo,
    userRepo,
    encrypter,
  );

  const listUsersUseCase = new ListUsersUseCase(userRepo);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepo);
  const updateUserUseCase = new UpdateUserUseCase(
    userRepo,
    userRepo,
    encrypter,
  );
  const deleteUserUseCase = new DeleteUserUseCase(userRepo, userRepo);

  const createUserController = new CreateUserController(createUserUseCase);
  const listUsersController = new ListUsersController(listUsersUseCase);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
  const updateUserController = new UpdateUserController(updateUserUseCase);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  // 🔐 Proteção: crie usuário só com Admin (ajuste como você quiser)
  router.post(
    "/admin/users",
    authMiddleware,
    authorizeRoles(["Admin"]),
    validateBody(createUserSchema),
    adaptRoute(createUserController),
  );

  router.get(
    "/admin/users",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(listUsersController),
  );

  router.get(
    "/admin/users/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(getUserByIdController),
  );

  router.patch(
    "/admin/users/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    validateBody(updateUserSchema),
    adaptRoute(updateUserController),
  );

  router.delete(
    "/admin/users/:id",
    authMiddleware,
    authorizeRoles(["Admin"]),
    adaptRoute(deleteUserController),
  );
}
