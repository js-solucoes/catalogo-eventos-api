// src/modules/events/presentation/http/factories/make-update-event.controller.ts
import { FindCityByIdUseCase } from "@/modules/cities/application/use-cases/find-city-by-id.usecase";
import { SequelizeCityRepository } from "@/modules/cities/infra/sequelize/sequelize-city.repository";
import { UpdateEventUseCase } from "@/modules/events/application/use-cases/update-event.usecase";
import { SequelizeEventRepository } from "@/modules/events/infra/repositories/sequelize-event.repository";
import { UpdateEventController } from "../controllers/update-event.controller";

export function makeUpdateEventController() {
  const repo = new SequelizeEventRepository();
  const cidadeRepo = new SequelizeCityRepository();
  const usecaseFindCidadeById = new FindCityByIdUseCase(cidadeRepo);
  const useCase = new UpdateEventUseCase(repo, repo, usecaseFindCidadeById);
  return new UpdateEventController(useCase);
}
