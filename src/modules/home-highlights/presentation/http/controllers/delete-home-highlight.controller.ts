import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { DeleteHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/delete-home-highlight.usecase";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";

export class DeleteHomeHighlightController implements Controller {
    constructor(private readonly usecase: DeleteHomeHighlightUseCase) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const id = Number(httpRequest.pathParams?.id);
            const deleted = await this.usecase.execute(id);
            if (!deleted) {
                return notFound({ error: "HOME_HIGHLIGHT_NOT_FOUND", meta: { correlationId } });
            }
            return {
                statusCode: 200,
                body: { data: { deleted }, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("DeleteHomeHighlightController: erro ao excluir", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}