import { Controller } from "@/core/protocols";
import { CreateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { getPublicWebImageUploader } from "@/modules/media/infra/factories/compose-public-web-image-uploader";
import { CreateHomeBannerController } from "../controllers";

export const makeCreateHomeBannerController = (): Controller => {
  const repo = new SequelizeHomeBannerRepository();
  const images = getPublicWebImageUploader();
  const usecase = new CreateHomeBannerUseCase(repo, images);
  return new CreateHomeBannerController(usecase);
};
