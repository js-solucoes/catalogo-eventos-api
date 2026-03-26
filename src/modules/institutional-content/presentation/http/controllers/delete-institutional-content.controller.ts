import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { DeleteInstitutionalContentUseCase } from "@/modules/institutional-content/application/use-cases/delete-institutional-content.usecase";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";

export class DeleteInstitutionalContentController implements Controller {
    constructor(private readonly usecase: DeleteInstitutionalContentUseCase){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const id = Number(httpRequest.pathParams?.id);
            const deleted = await this.usecase.execute(id);
            if (!deleted) {
                return notFound({ error: "INSTITUTIONAL_CONTENT_NOT_FOUND", meta: { correlationId } });
            }
            return {
                statusCode: 200,
                body: { data: { deleted }, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("DeleteInstitutionalContentController: erro ao excluir", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
    
}