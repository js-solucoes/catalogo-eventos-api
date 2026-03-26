import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/update-home-highlight.usecase";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";
import { UpdateHomeHighlightDTO } from "@/modules/home-highlights/application/dto";

export class UpdateHomeHighlightController implements Controller {
    constructor(private readonly usecase: UpdateHomeHighlightUseCase) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const id = Number(httpRequest.pathParams?.id);
            const body = httpRequest.body as UpdateHomeHighlightDTO;
            const result = await this.usecase.execute(id, body);
            if (!result) {
                return notFound({ error: "HOME_HIGHLIGHT_NOT_FOUND", meta: { correlationId } });
            }
            return {
                statusCode: 200,
                body: { data: result, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("UpdateHomeHighlightController: erro ao atualizar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}