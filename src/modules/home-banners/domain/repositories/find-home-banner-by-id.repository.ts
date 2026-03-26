import { HomeBannerEntity } from "../entities/home-banner.entity";

export interface FindHomeBannerByIdRepository {
    findById(id: number): Promise<HomeBannerEntity|null>
}