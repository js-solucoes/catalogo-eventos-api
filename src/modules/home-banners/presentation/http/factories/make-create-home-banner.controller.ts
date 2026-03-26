import { Controller } from "@/core/protocols";
import { CreateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { CreateHomeBannerController } from "../controllers";

export const makeCreateHomeBannerController = (): Controller => {
  const repo = new SequelizeHomeBannerRepository();
  const usecase = new CreateHomeBannerUseCase(repo);
  return new CreateHomeBannerController(usecase);
};
