import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { created, mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/config/logger";
import { CreateHomeBannerDTO } from "@/modules/home-banners/application/dto";

export class CreateHomeBannerController implements Controller {
    constructor(private readonly usecase: CreateHomeBannerUseCase) {}
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const homeBanner = httpRequest.body as CreateHomeBannerDTO;
            const result = await this.usecase.execute(homeBanner);
            return created({ data: result, meta: { correlationId } } as any);
        } catch (error) {
            logger.error("CreateHomeBannerController: erro ao criar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}