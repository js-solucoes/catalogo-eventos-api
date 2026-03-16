import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { created, resource } from "@/core/http/http-resource";
import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { CreateEventUseCase } from "@/modules/events/application/use-cases/create-event.usecase";
import { eventLinks } from "../event-hateoas";

export class CreateEventController implements Controller {
  constructor(private readonly useCase: CreateEventUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;

    logger.info("Iniciando criação de evento", { correlationId, route: "CreateEventController" });

    try {
      const createdEvent = await this.useCase.execute(req.body as any);

      const body = resource(
        {
          id: createdEvent.id,
          titulo: createdEvent.titulo,
          cat: createdEvent.cat,
          data: createdEvent.data,
          hora: createdEvent.hora,
          local: createdEvent.local,
          preco: createdEvent.preco,
          img: createdEvent.img,
          desc: createdEvent.desc,
          cityId: createdEvent.cityId,
          createdAt: createdEvent.createdAt,
          updatedAt: createdEvent.updatedAt,
        },
        eventLinks(createdEvent.id),
        { version: "1.0.0" }
      );

      return created(body);
    } catch (error) {
      logger.error("Erro ao criar evento", { correlationId, error });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}