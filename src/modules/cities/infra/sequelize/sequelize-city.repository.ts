import { Transaction } from "sequelize";
import { CityEntity } from "../../domain/entities/city.entity";
import {
  CreateCityRepository,
  DeleteCityRepository,
  EditCityRepository,
  FindCityByIdRepository,
  FindCityByNameRepository,
  ListCityRepository,
} from "../../domain/repositories";
import { CityModel } from "../models/city-model";

export class SequelizeCityRepository
  implements
    CreateCityRepository,
    ListCityRepository,
    FindCityByIdRepository,
    EditCityRepository,
    DeleteCityRepository,
    FindCityByNameRepository
{
  constructor() {}
  async findByName(nome: string): Promise<CityEntity | null> {
    const city = await CityModel.findOne({ where: { nome } });
    if (!city) return null;
    return new CityEntity({
      id: city.id,
      nome: city.nome,
      desc: city.desc,
      uf: city.uf,
    });
  }

  async create(city: CityEntity, t?: Transaction): Promise<CityEntity> {
    const created = await CityModel.create(
      {
        id: 0, // Substitua pelo ID gerado pelo banco de dados
        nome: city.nome,
        desc: city.desc,
        uf: city.uf,
      },
      { transaction: t },
    );
    await CityModel.sync();
    return new CityEntity({
      id: created.id,
      nome: created.nome,
      desc: created.desc,
      uf: created.uf,
    });
  }

  async list(): Promise<CityEntity[]> {
    const cities = await CityModel.findAll();
    return cities.map(
      (city) =>
        new CityEntity({
          id: city.id,
          nome: city.nome,
          desc: city.desc,
          uf: city.uf,
        }),
    );
  }

  async findById(id: number): Promise<CityEntity | null> {
    const city = await CityModel.findByPk(id);
    if (!city) return null;

    return new CityEntity({
      id: city.id,
      nome: city.nome,
      desc: city.desc,
      uf: city.uf,
    });
  }

  async edit(
    id: number,
    city: Partial<CityEntity>,
    t?: Transaction,
  ): Promise<CityEntity | null> {
    // Implementação do método de edição usando Sequelize
    const cityUpdated = await CityModel.update(city, {
      where: { id },
      transaction: t,
    });
    await CityModel.sync();
    if (cityUpdated[0] === 0) return null;
    return this.findById(id);
  }

  async delete(id: number, t?: Transaction): Promise<boolean> {
    const deleted = await CityModel.destroy({
      where: { id },
      transaction: t,
    });
    await CityModel.sync();
    return deleted > 0;
  }
}
