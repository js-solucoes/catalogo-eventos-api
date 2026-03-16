import adaptRoute from "@/core/adapters/express-route-adapter";
import {
  CreateCityUseCase,
  DeleteCityUseCase,
  ListCityUseCase,
  UpdateCityUseCase,
} from "@/modules/cities/application/use-cases";
import { FindCityByIdUseCase } from "@/modules/cities/application/use-cases/find-city-by-id.usecase";
import { SequelizeCityRepository } from "@/modules/cities/infra/sequelize/sequelize-city.repository";
import { NextFunction, Request, Response } from "express";
import { Router } from "express-serve-static-core";
import {
  CreateCityController,
  DeleteCityController,
  ListCityController,
  UpdateCityController,
} from "../controller";
import { FindCityByIdController } from "../controller/find-city-by-id.controller";

export function registerCityRoutes(router: Router): void {
  const cityRepo = new SequelizeCityRepository();
  const createCityUseCase = new CreateCityUseCase(cityRepo, cityRepo);
  const listCityUseCase = new ListCityUseCase(cityRepo);
  const updateCityUseCase = new UpdateCityUseCase(cityRepo);
  const deleteCityUseCase = new DeleteCityUseCase(cityRepo);
  const findCityByIdUseCase = new FindCityByIdUseCase(cityRepo);

  // ADMIN ROUTE
  router.get(
    "/admin/cities",
    adaptRoute(new ListCityController(listCityUseCase)),
  );
  router.get(
    "/admin/cities/:id",
    adaptRoute(new FindCityByIdController(findCityByIdUseCase)),
  );
  router.post(
    "/admin/cities",
    adaptRoute(new CreateCityController(createCityUseCase)),
  );
  router.patch(
    "/admin/cities/:id",
    adaptRoute(new UpdateCityController(updateCityUseCase)),
  );
  router.delete(
    "/admin/cities/:id",
    adaptRoute(new DeleteCityController(deleteCityUseCase)),
  );

  // PUBLIC ROUTE
  router.get(
    "/public/cities",
    (req: Request, res: Response, next: NextFunction) => {},
  );
  router.get(
    "/public/cities/:slug",
    (req: Request, res: Response, next: NextFunction) => {},
  );
}
