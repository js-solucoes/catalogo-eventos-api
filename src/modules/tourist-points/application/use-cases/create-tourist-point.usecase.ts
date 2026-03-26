import { TouristPointEntity } from "../../domain/entities/tourist-point.entity";
import { CreateTouristPointRepository } from "../../domain/repositories/create-tourist-point.repository";
import { createTouristPointDTO } from "../dto";

export class CreateTouristPointUseCase {
  constructor(private readonly repository: CreateTouristPointRepository) {}

  async execute(
    touristPointDTO: createTouristPointDTO,
  ): Promise<createTouristPointDTO> {
    const input: TouristPointEntity = new TouristPointEntity({
      cityId: touristPointDTO.cityId,
      citySlug: touristPointDTO.citySlug,
      name: touristPointDTO.name,
      description: touristPointDTO.description,
      category: touristPointDTO.category,
      address: touristPointDTO.address,
      openingHours: touristPointDTO.openingHours,
      imageUrl: touristPointDTO.imageUrl,
      featured: touristPointDTO.featured,
      published: touristPointDTO.published,
    });
    const touristPoint = await this.repository.create(input);
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
