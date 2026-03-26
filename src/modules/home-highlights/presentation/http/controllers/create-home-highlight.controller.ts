import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreateHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/create-home-highlight.usecase";
import { CreateHomeHighlightDTO } from "@/modules/home-highlights/application/dto";
import { created, mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/config/logger";

export class CreateHomeHighlightController implements Controller {
  constructor(private readonly usecase: CreateHomeHighlightUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const body = httpRequest.body as CreateHomeHighlightDTO;
      const result = await this.usecase.execute(body);
      if (!result) {
        return mapErrorToHttpResponse(
          new Error("Falha ao criar destaque"),
          correlationId,
        );
      }
      return created({
        data: result,
        links: {},
        meta: { correlationId },
      });
    } catch (error) {
      logger.error("CreateHomeHighlightController: erro ao criar", {
        correlationId,
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
