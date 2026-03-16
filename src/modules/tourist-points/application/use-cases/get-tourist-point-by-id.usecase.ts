import { TouristPointEntity } from "../../domain/entities/tourist-point.entity";
import { SequelizeTouristPointRepository } from "../../infra/sequelize/sequelize-tourist-point.repository";

export class GetTouristPointByIdUseCase {
  constructor(private readonly repository: SequelizeTouristPointRepository) {}

  async execute(id: number): Promise<TouristPointEntity | null> {
    return await this.repository.findById(id);
  }
}
