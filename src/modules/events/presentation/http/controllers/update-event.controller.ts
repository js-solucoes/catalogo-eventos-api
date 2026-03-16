// src/modules/events/presentation/http/controllers/update-event.controller.ts
import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { ok, resource } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateEventUseCase } from "@/modules/events/application/use-cases/update-event.usecase";
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
      const body = req.body as any;

      const updated = await this.useCase.execute(id, {
        ...body,
      });

      const payload = resource(
        {
          id: updated.id,
          titulo: updated.titulo,
          cat: updated.cat,
          data: updated.data,
          hora: updated.hora,
          local: updated.local,
          preco: updated.preco,
          img: updated.img,
          desc: updated.desc,
          cityId: updated.cityId,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        },
        eventLinks(updated.id),
        { version: "1.0.0" },
      );

      logger.info("Evento atualizado com sucesso", {
        correlationId,
        route: "UpdateEventController",
        eventId: updated.id,
      });

      return ok(payload);
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
