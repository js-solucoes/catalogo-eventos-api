import { HomeBannerEntity } from "../entities/home-banner.entity";

export interface CreateHomeBannerRepository {
    create(homeBanner: Omit<HomeBannerEntity, "id">): Promise<HomeBannerEntity|null>
}