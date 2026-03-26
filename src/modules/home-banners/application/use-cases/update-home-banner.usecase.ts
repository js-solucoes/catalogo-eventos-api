import { DomainLogger, NoopDomainLogger } from "@/core/logger";
import type { PublicWebImageUploader } from "@/modules/media/domain/ports/public-web-image.uploader";
import {
  FindHomeBannerByIdRepository,
  UpdateHomeBannerRepository,
} from "../../domain/repositories";
import { UpdateHomeBannerDTO } from "../dto";
import { HomeBannerProps } from "../../domain/entities/home-banner.entity";

export class UpdateHomeBannerUseCase {
  constructor(
    private readonly findById: FindHomeBannerByIdRepository,
    private readonly repo: UpdateHomeBannerRepository,
    private readonly images: PublicWebImageUploader,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}
  async execute(id: number, homeBanner: UpdateHomeBannerDTO) {
    const existing = await this.findById.findById(id);
    if (!existing) return null;

    const { image, ...rest } = homeBanner;
    const entity: Partial<HomeBannerProps> = { ...rest };

    if (image) {
      const { url } = await this.images.replacePublicWebImage(
        existing.imageUrl,
        image,
        "home-banners",
      );
      entity.imageUrl = url;
    }

    return await this.repo.update(id, entity);
  }
}