import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { ok, ResourceBuilder } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { GetEventByIdUseCase } from "@/modules/events/application/use-cases/get-event-by-id.usecase";
import { eventPublicLinks } from "../event-hateoas";

export class GetEventByIdController implements Controller {
  constructor(private readonly useCase: GetEventByIdUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;

    try {
      const id = Number(req.params?.id);
      const entity = await this.useCase.execute(id);

      const payload = {
        id: entity.id,
        cityId: entity.cityId,
        citySlug: entity.citySlug,
        name: entity.name,
        description: entity.description,
        category: entity.category as unknown as string,
        startDate: entity.startDate,
        endDate: entity.endDate,
        formattedDate: entity.formattedDate,
        location: entity.location,
        imageUrl: entity.imageUrl,
        featured: entity.featured,
        published: entity.published,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };

      const builder = new ResourceBuilder(payload);
      const resource = builder
        .addAllLinks(eventPublicLinks(entity.id))
        .addMeta({ correlationId, version: "1.0.0" })
        .build();

      return ok(resource);
    } catch (error) {
      logger.error("Erro ao buscar evento por id", {
        correlationId,
        route: "GetEventByIdController",
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
