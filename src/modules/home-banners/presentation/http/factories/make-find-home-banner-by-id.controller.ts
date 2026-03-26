import { Controller } from "@/core/protocols";
import { FindHomeBannerByIdUseCase } from "@/modules/home-banners/application/use-cases";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { FindHomeBannerByIdController } from "../controllers";

export const makeFindHomeBannerByIdController = (): Controller => {
  const repo = new SequelizeHomeBannerRepository();
  const usecase = new FindHomeBannerByIdUseCase(repo);
  return new FindHomeBannerByIdController(usecase);
};
