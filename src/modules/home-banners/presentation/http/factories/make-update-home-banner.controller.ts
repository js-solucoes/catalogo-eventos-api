import { Controller } from "@/core/protocols";
import { UpdateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { getPublicWebImageUploader } from "@/modules/media/infra/factories/compose-public-web-image-uploader";
import { UpdateHomeBannerController } from "../controllers";

export const makeUpdateHomeBannerController = (): Controller => {
  const repo = new SequelizeHomeBannerRepository();
  const images = getPublicWebImageUploader();
  const usecase = new UpdateHomeBannerUseCase(repo, repo, images);
  return new UpdateHomeBannerController(usecase);
};
