import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { GetHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/config/logger";

export class GetHomeBannerController implements Controller {
    constructor(private readonly usecase: GetHomeBannerUseCase) {}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const result = await this.usecase.execute();
            return {
                statusCode: 200,
                body: { data: result, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("GetHomeBannerController: erro ao listar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}