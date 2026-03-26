import { DomainLogger, NoopDomainLogger } from "@/core/logger";
import { CreateHomeBannerDTO } from "../dto";
import { CreateHomeBannerRepository } from "../../domain/repositories";
import { HomeBannerEntity } from "../../domain/entities/home-banner.entity";

export class CreateHomeBannerUseCase {
  constructor(
    private readonly repo: CreateHomeBannerRepository,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}
  async execute(homeBanner: CreateHomeBannerDTO) {

    const entity: Omit<HomeBannerEntity, "id"> = {
      title: homeBanner.title,
      subtitle: homeBanner.subtitle,
      imageUrl: homeBanner.imageUrl,
      ctaLabel: homeBanner.ctaLabel,
      ctaUrl: homeBanner.ctaUrl,
      active: homeBanner.active,
      order: homeBanner.order
    }
    return await this.repo.create(entity)
  }
}
