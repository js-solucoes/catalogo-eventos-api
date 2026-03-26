import { GetHomeBannerRepository } from "@/modules/home-banners/domain/repositories/get-home-banner.repository";
import { GetHomeHighlightRepository } from "@/modules/home-highlights/domain/repositories/get-home-highlight.repository";
import { HomeBannerEntity } from "@/modules/home-banners/domain/entities/home-banner.entity";
import { HomeHighlightEntity } from "@/modules/home-highlights/domain/entities/home-highlight.entity";

export interface HomeLandingContentResult {
  banners: HomeBannerEntity[];
  highlights: HomeHighlightEntity[];
}

export class GetHomeLandingContentUseCase {
  constructor(
    private readonly bannersRepo: GetHomeBannerRepository,
    private readonly highlightsRepo: GetHomeHighlightRepository,
  ) {}

  async execute(): Promise<HomeLandingContentResult> {
    const [banners, highlights] = await Promise.all([
      this.bannersRepo.getAll(),
      this.highlightsRepo.getAll(),
    ]);

    return {
      banners: banners ?? [],
      highlights: highlights ?? [],
    };
  }
}
