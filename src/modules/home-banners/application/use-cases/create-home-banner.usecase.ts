import { DomainLogger, NoopDomainLogger } from "@/core/logger";
import type { PublicWebImageUploader } from "@/modules/media/domain/ports/public-web-image.uploader";
import { CreateHomeBannerDTO } from "../dto";
import { CreateHomeBannerRepository } from "../../domain/repositories";
import { HomeBannerEntity } from "../../domain/entities/home-banner.entity";

export class CreateHomeBannerUseCase {
  constructor(
    private readonly repo: CreateHomeBannerRepository,
    private readonly images: PublicWebImageUploader,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}
  async execute(homeBanner: CreateHomeBannerDTO) {
    const { image, ...rest } = homeBanner;
    const { url: imageUrl } = await this.images.uploadPublicWebImage(
      image,
      "home-banners",
    );

    const entity: Omit<HomeBannerEntity, "id"> = {
      ...rest,
      imageUrl,
    };
    return await this.repo.create(entity);
  }
}
