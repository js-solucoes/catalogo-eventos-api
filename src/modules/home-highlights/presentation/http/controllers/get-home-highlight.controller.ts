import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { GetHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/get-home-highlight.usecase";
import { mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/config/logger";

export class GetHomeHighlightController implements Controller {
    constructor(private readonly usecase: GetHomeHighlightUseCase) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const result = await this.usecase.execute();
            return {
                statusCode: 200,
                body: { data: result, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("GetHomeHighlightController: erro ao listar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}