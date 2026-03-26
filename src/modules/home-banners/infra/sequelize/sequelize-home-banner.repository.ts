import { HomeBannerEntity } from "../../domain/entities/home-banner.entity";
import {
  CreateHomeBannerRepository,
  DeleteHomeBannerRepository,
  FindHomeBannerByIdRepository,
  GetHomeBannerRepository,
  UpdateHomeBannerRepository,
} from "../../domain/repositories";
import HomeBannerModel from "../model/home-banners-model";

export class SequelizeHomeBannerRepository
  implements
    CreateHomeBannerRepository,
    DeleteHomeBannerRepository,
    FindHomeBannerByIdRepository,
    GetHomeBannerRepository,
    UpdateHomeBannerRepository
{
  async create(
    homeBanner: Omit<HomeBannerEntity, "id">,
  ): Promise<HomeBannerEntity | null> {
    const result = await HomeBannerModel.create({ ...homeBanner });

    return new HomeBannerEntity({
      id: result.id,
      title: result.title,
      subtitle: result.subtitle,
      imageUrl: result.imageUrl,
      ctaLabel: result.ctaLabel,
      ctaUrl: result.ctaUrl,
      active: result.active,
      order: result.order,
    });
  }
  async delete(id: number): Promise<boolean> {
    const deleted = await HomeBannerModel.destroy({ where: { id } });
    return deleted > 0;
  }
  async findById(id: number): Promise<HomeBannerEntity | null> {
    const result = await HomeBannerModel.findByPk(id);
    if (!result) return null;
    return new HomeBannerEntity({
      id: result.id,
      title: result.title,
      subtitle: result.subtitle,
      imageUrl: result.imageUrl,
      ctaLabel: result.ctaLabel,
      ctaUrl: result.ctaUrl,
      active: result.active,
      order: result.order,
    });
  }
  async getAll(): Promise<HomeBannerEntity[] | null> {
    const result = await HomeBannerModel.findAll();

    return result.map(
      (h) =>
        new HomeBannerEntity({
          id: h.id,
          title: h.title,
          subtitle: h.subtitle,
          imageUrl: h.imageUrl,
          ctaLabel: h.ctaLabel,
          ctaUrl: h.ctaUrl,
          active: h.active,
          order: h.order,
        }),
    );
  }
  async update(
    id: number,
    homeBanner: Partial<HomeBannerEntity>,
  ): Promise<HomeBannerEntity | null> {
    const found = await HomeBannerModel.findByPk(id)
    if(!found) return null
    const result = await found.update({
      title: homeBanner.title ?? found.title,
      subtitle: homeBanner.subtitle ?? found.subtitle,
      imageUrl: homeBanner.imageUrl ?? found.imageUrl,
      ctaLabel: homeBanner.ctaLabel ?? found.ctaLabel,
      ctaUrl: homeBanner.ctaUrl ?? found.ctaUrl,
      active: homeBanner.active ?? found.active,
      order: homeBanner.order ?? found.order,
    })

    return new HomeBannerEntity({
      id: result.id,
      title: result.title,
      subtitle: result.subtitle,
      imageUrl: result.imageUrl,
      ctaLabel: result.ctaLabel,
      ctaUrl: result.ctaUrl,
      active: result.active,
      order: result.order,
    });
  }
}
