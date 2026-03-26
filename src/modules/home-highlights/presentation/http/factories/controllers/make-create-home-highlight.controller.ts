import { Controller } from "@/core/protocols";
import { SequelizeHomeHighlightRepository } from "@/modules/home-highlights/infra/sequelize/sequelize-home-highlight.repository";
import { CreateHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/create-home-highlight.usecase";
import { CreateHomeHighlightController } from "../../controllers/create-home-highlight.controller";

export const makeCreateHomeHighlightController = (): Controller => {
  const repo = new SequelizeHomeHighlightRepository();
  const usecase = new CreateHomeHighlightUseCase(repo);
  return new CreateHomeHighlightController(usecase);
};
