import { Transaction } from "sequelize";
import { TouristPointEntity } from "../entities/tourist-point.entity";

export interface UpdateTouristPointRepository {
  update(
    id: number,
    data: Partial<TouristPointEntity>,
    t?: Transaction,
  ): Promise<TouristPointEntity | null>;
}
