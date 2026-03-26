import { HomeHighlightEntity } from "../../domain/entities/home-highlight.entity";
import { FindHomeHighlightByIdRepository } from "../../domain/repositories/find-home-highlight-by-id.repository";
import { UpdateHomeHighlightRepository } from "../../domain/repositories/update-home-highlight.repository";
import { UpdateHomeHighlightDTO } from "../dto";

export class UpdateHomeHighlightUseCase {
  constructor(
    private readonly findByIdRepo: FindHomeHighlightByIdRepository,
    private readonly updateRepo: UpdateHomeHighlightRepository,
  ) {}

  async execute(
    id: number,
    __homeHighlight: UpdateHomeHighlightDTO,
  ): Promise<HomeHighlightEntity | null> {
    const existing = await this.findByIdRepo.findById(id);
    if (!existing) return null;

    const entity = new HomeHighlightEntity({
      id,
      type: __homeHighlight.type ?? existing.type,
      referenceId: __homeHighlight.referenceId ?? existing.referenceId,
      title: __homeHighlight.title ?? existing.title,
      description: __homeHighlight.description ?? existing.description,
      cityName: __homeHighlight.cityName ?? existing.cityName,
      imageUrl: __homeHighlight.imageUrl ?? existing.imageUrl,
      ctaUrl: __homeHighlight.ctaUrl ?? existing.ctaUrl,
      active: __homeHighlight.active ?? existing.active,
      order: __homeHighlight.order ?? existing.order,
    });
    return await this.updateRepo.update(id, entity);
  }
}
