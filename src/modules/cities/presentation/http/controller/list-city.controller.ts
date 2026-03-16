import { mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/logger";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ListCityUseCase } from "@/modules/cities/application/use-cases";

export class ListCityController implements Controller {
  constructor(private readonly listCitiesUseCase: ListCityUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const correlationId = request.correlationId;
    try {
      const cities = await this.listCitiesUseCase.execute();
      return {
        statusCode: 200,
        body: cities,
      };
    } catch (error) {
      logger.error("Erro ao listar cidades", {
        correlationId,
        route: "ListCidadeController",
        error,
      });

      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
