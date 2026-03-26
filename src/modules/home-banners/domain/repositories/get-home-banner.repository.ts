import { HomeBannerEntity } from "../entities/home-banner.entity";

export interface GetHomeBannerRepository {
    getAll(): Promise<HomeBannerEntity[]|null>
}