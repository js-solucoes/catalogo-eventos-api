import { mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/logger";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { FindCityByIdUseCase } from "@/modules/cities/application/use-cases/find-city-by-id.usecase";

export class FindCityByIdController implements Controller {
  constructor(private readonly findCityByIdUseCase: FindCityByIdUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const correlationId = request.correlationId;
    try {
      const cityId = Number(request.params?.id);
      const city = await this.findCityByIdUseCase.execute(cityId);
      return {
        statusCode: 200,
        body: city,
      };
    } catch (error) {
      logger.error("Erro ao buscar cidade", {
        correlationId,
        route: "FindCidadeByIdController",
        error,
      });

      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
