import { DomainLogger, NoopDomainLogger } from "@/core/logger";
import { UpdateHomeBannerRepository } from "../../domain/repositories";
import { UpdateHomeBannerDTO } from "../dto";
import { HomeBannerEntity } from "../../domain/entities/home-banner.entity";

export class UpdateHomeBannerUseCase {
  constructor(
    private readonly repo: UpdateHomeBannerRepository,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}
  async execute(id: number, homeBanner: UpdateHomeBannerDTO) {
    const entity:Partial<HomeBannerEntity> = {
      title: homeBanner.title,
      subtitle: homeBanner.subtitle,
      imageUrl: homeBanner.imageUrl,
      ctaLabel: homeBanner.ctaLabel,
      ctaUrl: homeBanner.ctaUrl,
      active: homeBanner.active,
      order: homeBanner.order
    }
    return await this.repo.update(id, entity)
  }
}