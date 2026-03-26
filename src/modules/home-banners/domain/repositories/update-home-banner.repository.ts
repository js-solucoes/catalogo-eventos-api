import { HomeBannerEntity } from "../entities/home-banner.entity";

export interface UpdateHomeBannerRepository {
    update(id: number,homeBanner: Partial<HomeBannerEntity>): Promise<HomeBannerEntity|null>
}