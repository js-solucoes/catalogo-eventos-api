import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { FindHomeHighlightByIdUseCase } from "@/modules/home-highlights/application/use-cases/find-home-highlight-by-id.usecase";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";

export class FindHomeHighlightByIdController implements Controller {
    constructor(private readonly usecase: FindHomeHighlightByIdUseCase) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const id = Number(httpRequest.pathParams?.id);
            const result = await this.usecase.execute(id);
            if (!result) {
                return notFound({ error: "HOME_HIGHLIGHT_NOT_FOUND", meta: { correlationId } });
            }
            return {
                statusCode: 200,
                body: { data: result, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("FindHomeHighlightByIdController: erro ao buscar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}