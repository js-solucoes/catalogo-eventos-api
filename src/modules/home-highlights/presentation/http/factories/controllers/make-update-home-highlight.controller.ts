import { Controller } from "@/core/protocols";
import { UpdateHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/update-home-highlight.usecase";
import { SequelizeHomeHighlightRepository } from "@/modules/home-highlights/infra/sequelize/sequelize-home-highlight.repository";
import { UpdateHomeHighlightController } from "../../controllers/update-home-highlight.controller";

export const makeUpdateHomeHighlightController = (): Controller => {
  const repo = new SequelizeHomeHighlightRepository();
  const usecase = new UpdateHomeHighlightUseCase(repo, repo);
  return new UpdateHomeHighlightController(usecase);
};