import { AppError } from "@/core/errors-app-error";
import { DomainLogger, NoopDomainLogger } from "@/core/logger/domain-logger";
import { EventEntity } from "../../domain/entities/event.entity";
import { CreateEventDTO } from "../dto";

// ajuste os imports conforme suas interfaces reais
import { FindCityByIdUseCase } from "@/modules/cities/application/use-cases/find-city-by-id.usecase";
import { CreateEventRepository } from "../../domain/repositories/create-event.repository";

export class CreateEventUseCase {
  constructor(
    private readonly createRepo: CreateEventRepository,
    private readonly findCityById: FindCityByIdUseCase,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}

  async execute(dto: CreateEventDTO): Promise<EventEntity> {
    this.logger.info("CreateEventUseCase:start", {
      cityId: dto.cityId,
      cat: dto.cat,
    });

    const city = await this.findCityById.execute(dto.cityId);
    if (!city) {
      throw new AppError({
        code: "CIDADE_NOT_FOUND",
        message: `Cidade ${dto.cityId} não encontrada`,
        statusCode: 404,
        details: { cityId: dto.cityId },
      });
    }

    const entity = new EventEntity({
      id: 0,
      ...dto,
    });

    const created = await this.createRepo.create(entity);

    this.logger.info("CreateEventUseCase:success", {
      id: created.id,
      cityId: created.cityId,
    });
    return created;
  }
}
