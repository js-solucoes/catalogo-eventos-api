import { CityEntity } from "../../domain/entities/city.entity";
import { FindCityByIdRepository } from "../../domain/repositories/find-city-by-id.repository";

export class FindCityByIdUseCase {
  constructor(private findCityByIdRepository: FindCityByIdRepository) {}

  async execute(id: number): Promise<CityEntity | null> {
    return await this.findCityByIdRepository.findById(id);
  }
}
