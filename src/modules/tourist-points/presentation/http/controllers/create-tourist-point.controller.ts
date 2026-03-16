import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { created, resource } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreateTouristPointUseCase } from "../../../application/use-cases/create-tourist-point.usecase";
import { touristPointLinks } from "../tourist-point-hateoas";

export class CreateTouristPointController implements Controller {
  constructor(private readonly useCase: CreateTouristPointUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;

    logger.info("Criando ponto turístico", {
      correlationId,
      route: "CreatePontoTuristicoController",
    });

    try {
      const createdEntity = await this.useCase.execute(req.body);

      if (!createdEntity || !createdEntity.id) {
        logger.warn("CreatePontoTuristicoController: entidade criada é nula", {
          correlationId,
          route: "CreatePontoTuristicoController",
        });
        return mapErrorToHttpResponse(
          new Error("Erro ao criar ponto turístico"),
          correlationId,
        );
      }

      const data = {
        id: createdEntity.id,
        nome: createdEntity.nome,
        cityId: createdEntity.cityId,
        desc: createdEntity.desc,
        horario: createdEntity.horario,
      };

      return created(
        resource(data, touristPointLinks(createdEntity.id), {
          version: "1.0.0",
        }),
      );
    } catch (error) {
      logger.error("Erro ao criar ponto turístico", {
        correlationId,
        route: "CreatePontoTuristicoController",
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
