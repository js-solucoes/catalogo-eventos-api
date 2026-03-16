import sequelize from "@/core/database";
import { AppError } from "@/core/errors-app-error";
import { DomainLogger, NoopDomainLogger } from "@/core/logger/domain-logger";
import { CityEntity } from "../../domain/entities/city.entity";
import { FindCityByNameRepository } from "../../domain/repositories";
import { CreateCityRepository } from "../../domain/repositories/create-city.repository";
import { CreateCityDTO } from "../dto";

export class CreateCityUseCase {
  constructor(
    private createCityRepository: CreateCityRepository,
    private readonly findCityByNameRepository: FindCityByNameRepository,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}

  async execute(dto: CreateCityDTO): Promise<CityEntity> {
    this.logger.info("Iniciando CreateCidadeUseCase", {
      nome: dto.nome,
      uf: dto.uf,
    });

    const existing = await this.findCityByNameRepository.findByName(dto.nome);

    if (existing) {
      throw new AppError({
        code: "CITY_ALREADY_EXISTS",
        message: `A cidade ${dto.nome} já está cadastrada`,
        statusCode: 409,
        details: { nome: dto.nome },
      });
    }
    const transaction = await sequelize.transaction();

    try {
      const city = new CityEntity({
        id: 0,
        nome: dto.nome,
        uf: dto.uf,
        desc: dto.desc,
      });

      const created = await this.createCityRepository.create(
        city,
        transaction,
      );

      await transaction.commit();

      this.logger.info("Cidade criada com sucesso", {
        cityId: created.id,
        nome: created.nome,
        uf: created.uf,
      });
      return created;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
