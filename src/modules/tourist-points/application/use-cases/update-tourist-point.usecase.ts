import { AppError } from "@/core/errors-app-error";
import { UpdateTouristPointRepository } from "../../domain/repositories/update-tourist-point.repository";
import { updateTouristPointDTO } from "../dto";

export class UpdateTouristPointUseCase {
  constructor(private readonly repository: UpdateTouristPointRepository) {}

  async execute(
    id: number,
    input: updateTouristPointDTO,
  ): Promise<updateTouristPointDTO> {
    const touristPoint = await this.repository.update(id, input);
    if (!touristPoint) {
      throw new AppError({
        code: "PONTO_TURISTICO_NOT_FOUND",
        message: "Ponto turístico não encontrado",
        statusCode: 404,
      });
    }
    return {
      id: touristPoint.id,
      cityId: touristPoint.cityId,
      citySlug: touristPoint.citySlug,
      name: touristPoint.name,
      description: touristPoint.description,
      category: touristPoint.category,
      address: touristPoint.address,
      openingHours: touristPoint.openingHours,
      imageUrl: touristPoint.imageUrl,
      featured: touristPoint.featured,
      published: touristPoint.published,
    };
  }
}
