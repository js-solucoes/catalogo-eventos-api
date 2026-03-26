import { GetHomeLandingContentUseCase } from "@/modules/home-content/application/use-cases/get-home-landing-content.usecase";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";
import { SequelizeHomeHighlightRepository } from "@/modules/home-highlights/infra/sequelize/sequelize-home-highlight.repository";
import { GetHomeLandingContentController } from "../controllers/get-home-landing-content.controller";

export function makeGetHomeLandingContentController() {
  const bannerRepo = new SequelizeHomeBannerRepository();
  const highlightRepo = new SequelizeHomeHighlightRepository();
  const usecase = new GetHomeLandingContentUseCase(bannerRepo, highlightRepo);
  return new GetHomeLandingContentController(usecase);
}
