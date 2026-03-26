import { Controller } from "@/core/protocols";
import { DeleteHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { DeleteHomeBannerController } from "../controllers";

export const makeDeleteHomeBannerController = (): Controller => {
  const repo = new SequelizeHomeBannerRepository();
  const usecase = new DeleteHomeBannerUseCase(repo);
  return new DeleteHomeBannerController(usecase);
};
