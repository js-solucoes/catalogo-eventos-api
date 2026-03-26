import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { FindHomeBannerByIdUseCase } from "@/modules/home-banners/application/use-cases";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";

export class FindHomeBannerByIdController implements Controller {
    constructor(private readonly usecase: FindHomeBannerByIdUseCase) {}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const id = Number(httpRequest.pathParams?.id);
            const result = await this.usecase.execute(id);
            if (!result) {
                return notFound({ error: "HOME_BANNER_NOT_FOUND", meta: { correlationId } });
            }
            return {
                statusCode: 200,
                body: { data: result, meta: { correlationId } },
            };
        } catch (error) {
            logger.error("FindHomeBannerByIdController: erro ao buscar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}