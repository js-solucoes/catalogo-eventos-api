import { mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/logger";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateCityUseCase } from "@/modules/cities/application/use-cases";

export class UpdateCityController implements Controller {
  constructor(private readonly updateCityUseCase: UpdateCityUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const correlationId = request.correlationId;
    try {
      const cityId = Number(request.params?.id);
      const updatedCity = await this.updateCityUseCase.execute(
        cityId,
        request.body,
      );
      return {
        statusCode: 200,
        body: updatedCity,
      };
    } catch (error) {
      logger.error("Erro ao atualizar cidade", {
        correlationId,
        route: "UpdateCidadeController",
        error,
      });

      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
