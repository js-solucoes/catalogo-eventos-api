// src/modules/events/presentation/http/controllers/update-event.controller.ts
import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { ok, ResourceBuilder } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateEventUseCase } from "@/modules/events/application/use-cases/update-event.usecase";
import { UpdateEventDTO } from "@/modules/events/application/dto";
import { eventLinks } from "../event-hateoas";

export class UpdateEventController implements Controller {
  constructor(private readonly useCase: UpdateEventUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;

    logger.info("Iniciando update de evento", {
      correlationId,
      route: "UpdateEventController",
      params: req.params,
      body: req.body,
    });

    try {
      const id = Number(req.params?.id);
      const body = req.body as UpdateEventDTO;

      const updated = await this.useCase.execute(id, body);

      const payload = {
        id: updated.id,
        cityId: updated.cityId,
        citySlug: updated.citySlug,
        name: updated.name,
        description: updated.description,
        category: updated.category,
        startDate: updated.startDate,
        endDate: updated.endDate,
        formattedDate: updated.formattedDate,
        location: updated.location,
        imageUrl: updated.imageUrl,
        featured: updated.featured,
        published: updated.published,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
      const builder = new ResourceBuilder(payload);
      const resource = builder
        .addAllLinks(eventLinks(updated.id))
        .addMeta({ correlationId, version: "1.0.0" })
        .build();

      logger.info("Evento atualizado com sucesso", {
        correlationId,
        route: "UpdateEventController",
        eventId: updated.id,
      });

      return ok(resource);
    } catch (error) {
      logger.error("Erro ao atualizar evento", {
        correlationId,
        route: "UpdateEventController",
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
