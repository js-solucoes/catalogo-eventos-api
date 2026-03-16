import { AppError } from "@/core/errors-app-error";
import { SequelizeTouristPointRepository } from "../../infra/sequelize/sequelize-tourist-point.repository";
import { updateTouristPointDTO } from "../dto";

export class UpdateTouristPointUseCase {
  constructor(private readonly repository: SequelizeTouristPointRepository) {}

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
      nome: touristPoint.nome,
      tipo: touristPoint.tipo,
      horario: touristPoint.horario,
      img: touristPoint.img,
      desc: touristPoint.desc,
      cityId: touristPoint.cityId,
    };
  }
}
