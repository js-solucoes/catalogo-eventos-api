import { CityEntity } from "../../domain/entities/city.entity";
import { EditCityRepository } from "../../domain/repositories/edit-city.repository";

export class UpdateCityUseCase {
  constructor(private editCityRepository: EditCityRepository) {}

  async execute(
    id: number,
    cityData: Partial<CityEntity>,
  ): Promise<CityEntity | null> {
    return await this.editCityRepository.edit(id, cityData);
  }
}
