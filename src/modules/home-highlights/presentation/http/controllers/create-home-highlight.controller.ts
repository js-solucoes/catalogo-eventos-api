import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreateHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/create-home-highlight.usecase";
import { CreateHomeHighlightDTO } from "@/modules/home-highlights/application/dto";
import { HomeHighlightEntity } from "@/modules/home-highlights/domain/entities/home-highlight.entity";
import { created, mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/config/logger";

export class CreateHomeHighlightController implements Controller {
    constructor(private readonly usecase: CreateHomeHighlightUseCase) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const body = httpRequest.body as CreateHomeHighlightDTO;
            const entity = new HomeHighlightEntity({
                id: 0,
                type: body.type,
                referenceId: body.referenceId,
                title: body.title,
                description: body.description,
                cityName: body.cityName,
                imageUrl: body.imageUrl,
                ctaUrl: body.ctaUrl,
                active: body.active,
                order: body.order,
            });
            const result = await this.usecase.execute(body);
            return created({ data: result ?? entity, meta: { correlationId } } as any);
        } catch (error) {
            logger.error("CreateHomeHighlightController: erro ao criar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
}