import { CreateTouristPointUseCase } from "@/modules/tourist-points/application/use-cases/create-tourist-point.usecase";
import { DeleteTouristPointUseCase } from "@/modules/tourist-points/application/use-cases/delete-tourist-point.usecase";
import { GetTouristPointByIdUseCase } from "@/modules/tourist-points/application/use-cases/get-tourist-point-by-id.usecase";
import { ListTouristPointsUseCase } from "@/modules/tourist-points/application/use-cases/list-tourist-points.usecase";
import { UpdateTouristPointUseCase } from "@/modules/tourist-points/application/use-cases/update-tourist-point.usecase";
import { SequelizeTouristPointRepository } from "@/modules/tourist-points/infra/sequelize/sequelize-tourist-point.repository";

export function makeCreateTouristPointUseCase() {
  const repo = new SequelizeTouristPointRepository();
  return new CreateTouristPointUseCase(repo);
}

export function makeListTouristPointsUseCase() {
  const repo = new SequelizeTouristPointRepository();
  return new ListTouristPointsUseCase(repo);
}

export function makeGetTouristPointByIdUseCase() {
  const repo = new SequelizeTouristPointRepository();
  return new GetTouristPointByIdUseCase(repo);
}

export function makeUpdateTouristPointUseCase() {
  const repo = new SequelizeTouristPointRepository();
  return new UpdateTouristPointUseCase(repo);
}

export function makeDeleteTouristPointUseCase() {
  const repo = new SequelizeTouristPointRepository();
  return new DeleteTouristPointUseCase(repo);
}
