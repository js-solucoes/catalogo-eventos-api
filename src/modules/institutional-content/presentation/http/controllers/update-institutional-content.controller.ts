import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateInstitutionalContentUseCase } from "@/modules/institutional-content/application/use-cases/update-institutional-content.usecase";
import { UpdateInstitutionalContentDTO } from "@/modules/institutional-content/application/dto";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";

export class UpdateInstitutionalContentController implements Controller {
    constructor(private readonly usecase: UpdateInstitutionalContentUseCase){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const id = Number(httpRequest.pathParams?.id);
            const body = httpRequest.body as UpdateInstitutionalContentDTO;

            const result = await this.usecase.execute(id, body);
            if (!result) {
                return notFound({ error: "INSTITUTIONAL_CONTENT_NOT_FOUND", meta: { correlationId } });
            }

            return {
                statusCode: 200,
                body: { data: result, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("UpdateInstitutionalContentController: erro ao atualizar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
    
}