import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { created, resource, ResourceBuilder } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreateTouristPointUseCase } from "../../../application/use-cases/create-tourist-point.usecase";
import { touristPointLinks } from "../tourist-point-hateoas";

export class CreateTouristPointController implements Controller {
  constructor(private readonly useCase: CreateTouristPointUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;

    logger.info("Criando ponto turístico", {
      correlationId,
      route: "CreatePontoTuristicoController",
    });

    try {
      const createdEntity = await this.useCase.execute(req.body);

      if (!createdEntity || !createdEntity.id) {
        logger.warn("CreatePontoTuristicoController: entidade criada é nula", {
          correlationId,
          route: "CreatePontoTuristicoController",
        });
        return mapErrorToHttpResponse(
          new Error("Erro ao criar ponto turístico"),
          correlationId,
        );
      }

      const data = {
        id: createdEntity.id,
        cityId: createdEntity.cityId,
        citySlug: createdEntity.citySlug,
        name: createdEntity.name,
        description: createdEntity.description,
        category: createdEntity.category,
        address: createdEntity.address,
        openingHours: createdEntity.openingHours,
        imageUrl: createdEntity.imageUrl,
        featured: createdEntity.featured, // ✅ obrigatório pela model
        published: createdEntity.published,
      };
      const builder = new ResourceBuilder(data);
      const resource = builder
        .addAllLinks(touristPointLinks(createdEntity.id))
        .addMeta({ correlationId, version: "1.0.0" })
        .build();
      return created(resource);
    } catch (error) {
      logger.error("Erro ao criar ponto turístico", {
        correlationId,
        route: "CreatePontoTuristicoController",
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
