import {
  HomeBannerEntity,
  HomeBannerProps,
} from "../entities/home-banner.entity";

export interface UpdateHomeBannerRepository {
  update(
    id: number,
    homeBanner: Partial<HomeBannerProps>,
  ): Promise<HomeBannerEntity | null>;
}