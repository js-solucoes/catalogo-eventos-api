import { CreateEventUseCase } from "@/modules/events/application/use-cases/create-event.usecase";
import { CreateEventController } from "../controllers/create-event.controller";

// infra
import { NoopDomainLogger } from "@/core/logger/domain-logger";
import { FindCityByIdUseCase } from "@/modules/cities/application/use-cases/find-city-by-id.usecase";
import { SequelizeCityRepository } from "@/modules/cities/infra/sequelize/sequelize-city.repository";
import { SequelizeEventRepository } from "@/modules/events/infra/repositories/sequelize-event.repository";

export function makeCreateEventController() {
  const eventRepo = new SequelizeEventRepository();
  const cidadeRepo = new SequelizeCityRepository(); // ou repo do módulo de cidades
  const cidadeUseCase = new FindCityByIdUseCase(cidadeRepo);
  const usecase = new CreateEventUseCase(
    eventRepo,
    cidadeUseCase,
    new NoopDomainLogger(),
  );
  return new CreateEventController(usecase);
}
