import { Controller } from "@/core/protocols";
import { UpdateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { UpdateHomeBannerController } from "../controllers";

export const makeUpdateHomeBannerController = (): Controller => {
  const repo = new SequelizeHomeBannerRepository();
  const usecase = new UpdateHomeBannerUseCase(repo);
  return new UpdateHomeBannerController(usecase);
};
