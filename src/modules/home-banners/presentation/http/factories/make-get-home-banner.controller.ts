import { Controller } from "@/core/protocols";
import { GetHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { GetHomeBannerController } from "../controllers";

export const makeGetHomeBannerController = (): Controller => {
  const repo = new SequelizeHomeBannerRepository();
  const usecase = new GetHomeBannerUseCase(repo);
  return new GetHomeBannerController(usecase);
};
