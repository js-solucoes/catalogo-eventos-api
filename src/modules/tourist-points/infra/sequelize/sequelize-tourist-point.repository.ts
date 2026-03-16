import { Transaction } from "sequelize";
import { TouristPointEntity } from "../../domain/entities/tourist-point.entity";
import {
  CreateTouristPointRepository,
  DeleteTouristPointRepository,
  FindTouristPointByCityRepository,
  FindTouristPointByIdRepository,
  ListTouristPointsSpecificationRepository,
  UpdateTouristPointRepository,
} from "../../domain/repositories";
import { QuerySpecification } from "../../domain/specifications/query-specification";
import TouristPointModel from "../model/tourist-point-model";

export class SequelizeTouristPointRepository
  implements
    CreateTouristPointRepository,
    DeleteTouristPointRepository,
    FindTouristPointByCityRepository,
    FindTouristPointByIdRepository,
    UpdateTouristPointRepository,
    ListTouristPointsSpecificationRepository
{
  constructor() {}

  listSpec(params: {
    spec?: QuerySpecification | null;
    limit: number;
    offset: number;
    order: [string, "ASC" | "DESC"][];
  }): Promise<{ rows: any[]; count: number }> {
    const where = params.spec?.toWhere?.() ?? {};

    return TouristPointModel.findAndCountAll({
      where,
      limit: params.limit,
      offset: params.offset,
      order: params.order,
    });
  }

  async create(
    data: TouristPointEntity,
    t?: Transaction,
  ): Promise<TouristPointEntity> {
    const created = await TouristPointModel.create(
      {
        nome: data.nome,
        tipo: data.tipo ?? null,
        horario: data.horario ?? null,
        img: data.img,
        desc: data.desc ?? null,
        cityId: data.cityId, // ✅ obrigatório pela model
      },
      { transaction: t },
    );

    return new TouristPointEntity({
      id: created.id,
      nome: created.nome,
      tipo: created.tipo,
      horario: created.horario,
      img: created.img,
      desc: created.desc,
      cityId: created.cityId, // ✅
    });
  }

  async findById(id: number): Promise<TouristPointEntity | null> {
    const ponto = await TouristPointModel.findByPk(id);
    if (!ponto) return null;

    return new TouristPointEntity({
      id: ponto.id,
      nome: ponto.nome,
      tipo: ponto.tipo,
      horario: ponto.horario,
      img: ponto.img,
      desc: ponto.desc,
      cityId: ponto.cityId, // ✅
    });
  }

  async findByCityId(
    cityId: number,
  ): Promise<TouristPointEntity[] | null> {
    const pontos = await TouristPointModel.findAll({ where: { cityId } });

    return pontos.map(
      (p) =>
        new TouristPointEntity({
          id: p.id,
          nome: p.nome,
          tipo: p.tipo,
          horario: p.horario,
          img: p.img,
          desc: p.desc,
          cityId: p.cityId, // ✅
        }),
    );
  }

  async update(
    id: number,
    data: Partial<TouristPointEntity>,
    t?: Transaction,
  ): Promise<TouristPointEntity | null> {
    const [affected] = await TouristPointModel.update(
      {
        nome: data.nome,
        tipo: data.tipo,
        horario: data.horario,
        img: data.img,
        desc: data.desc,
        cityId: data.cityId,
      },
      { where: { id }, transaction: t },
    );

    if (affected === 0) return null;
    return this.findById(id);
  }

  async delete(id: number, t?: Transaction): Promise<boolean> {
    const deleted = await TouristPointModel.destroy({
      where: { id },
      transaction: t,
    });
    return deleted > 0;
  }
}
