import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreateInstitutionalContentUseCase } from "@/modules/institutional-content/application/use-cases/create-institutional-content.usecase";
import { CreateInstitutionalContentDTO } from "@/modules/institutional-content/application/dto";
import { InstitutionalContentEntity } from "@/modules/institutional-content/domain/entities/institutional-content.entity";
import { created, mapErrorToHttpResponse } from "@/core/http";
import { logger } from "@/core/config/logger";

export class CreateInstitutionalContentController implements Controller {
    constructor(private readonly usecase: CreateInstitutionalContentUseCase){}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const correlationId = httpRequest.correlationId;
        try {
            const body = httpRequest.body as CreateInstitutionalContentDTO;
            const entity = new InstitutionalContentEntity({
                id: 0,
                aboutTitle: body.aboutTitle,
                aboutText: body.aboutText,
                whoWeAreTitle: body.whoWeAreTitle,
                whoWeAreText: body.whoWeAreText,
                purposeTitle: body.purposeTitle,
                purposeText: body.purposeText,
                mission: body.mission,
                vision: body.vision,
                valuesJson: body.valuesJson,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await this.usecase.execute(entity);
            return created({ data: result, meta: { correlationId } } as any);
        } catch (error) {
            logger.error("CreateInstitutionalContentController: erro ao criar", {
                correlationId,
                error,
            });
            return mapErrorToHttpResponse(error, correlationId);
        }
    }
    
}