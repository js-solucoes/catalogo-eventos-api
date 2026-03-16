import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { ok, resource } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { GetTouristPointByIdUseCase } from "@/modules/tourist-points/application/use-cases/get-tourist-point-by-id.usecase";
import { touristPointLinks } from "../tourist-point-hateoas";

export class GetTouristPointByIdController implements Controller {
  constructor(private readonly useCase: GetTouristPointByIdUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;

    try {
      const id = Number(req.params?.id);
      const entity = await this.useCase.execute(id);

      if (!entity || !entity.id) {
        logger.warn("Ponto turístico não encontrado", {
          correlationId,
          route: "GetPontoTuristicoByIdController",
          id,
        });
        return mapErrorToHttpResponse(
          new Error("Ponto turístico não encontrado"),
          correlationId,
        );
      }

      const data = {
        id: entity.id,
        nome: entity.nome,
        cityId: entity.cityId,
        desc: entity.desc,
        horario: entity.horario,
      };

      return ok(resource(data, touristPointLinks(entity.id)));
    } catch (error) {
      logger.error("Erro ao buscar ponto turístico", {
        correlationId,
        route: "GetPontoTuristicoByIdController",
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
