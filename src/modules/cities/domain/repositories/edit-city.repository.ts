import { Transaction } from "sequelize";
import { CityEntity } from "../entities/city.entity";

export interface EditCityRepository {
  edit(
    id: number,
    cidade: Partial<CityEntity>,
    t?: Transaction,
  ): Promise<CityEntity | null>;
}
