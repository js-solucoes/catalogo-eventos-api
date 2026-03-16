import { TouristPointEntity } from "../../domain/entities/tourist-point.entity";
import { SequelizeTouristPointRepository } from "../../infra/sequelize/sequelize-tourist-point.repository";
import { createTouristPointDTO } from "../dto";

export class CreateTouristPointUseCase {
  constructor(private readonly repository: SequelizeTouristPointRepository) {}

  async execute(
    touristPointDTO: createTouristPointDTO,
  ): Promise<createTouristPointDTO> {
    const input: TouristPointEntity = new TouristPointEntity({
      nome: touristPointDTO.nome,
      tipo: touristPointDTO.tipo,
      horario: touristPointDTO.horario,
      img: touristPointDTO.img,
      desc: touristPointDTO.desc,
      cityId: touristPointDTO.cityId,
    });
    const touristPoint = await this.repository.create(input);
    return {
      id: touristPoint.id,
      nome: touristPoint.nome,
      tipo: touristPoint.tipo,
      horario: touristPoint.horario,
      img: touristPoint.img,
      desc: touristPoint.desc,
      cityId: touristPoint.cityId,
    };
  }
}
