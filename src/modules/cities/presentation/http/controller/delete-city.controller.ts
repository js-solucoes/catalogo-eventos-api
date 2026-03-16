import { mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/logger/logger";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { DeleteCityUseCase } from "@/modules/cities/application/use-cases";

export class DeleteCityController implements Controller {
  constructor(private readonly deleteCityUseCase: DeleteCityUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const correlationId = request.correlationId;
    try {
      const cityId = Number(request.params?.id);
      await this.deleteCityUseCase.execute(cityId);
      return {
        statusCode: 204,
        body: null,
      };
    } catch (error) {
      logger.error("Erro ao deletar cidade", {
        correlationId,
        route: "DeleteCityController",
        error,
      });

      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
