import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { ok, resource, ResourceBuilder } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { GetTouristPointByIdUseCase } from "@/modules/tourist-points/application/use-cases/get-tourist-point-by-id.usecase";
import { touristPointLinks, touristPointPublicLinks } from "../tourist-point-hateoas";

export type TouristPointByIdAudience = "admin" | "public";

export class GetTouristPointByIdController implements Controller {
  constructor(
    private readonly useCase: GetTouristPointByIdUseCase,
    private readonly audience: TouristPointByIdAudience = "admin",
  ) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;

    try {
      const id = Number(req.params?.id);
      const entity = await this.useCase.execute(id);

      if (!entity || !entity.id) {
        logger.warn("Ponto turístico não encontrado", {
          correlationId,
          route: "GetPontoTuristicoByIdController",
          id,
        });
        return mapErrorToHttpResponse(
          new Error("Ponto turístico não encontrado"),
          correlationId,
        );
      }

      const data = {
        id: entity.id,
        cityId: entity.cityId,
        citySlug: entity.citySlug,
        name: entity.name,
        description: entity.description,
        category: entity.category,
        address: entity.address,
        openingHours: entity.openingHours,
        imageUrl: entity.imageUrl,
        featured: entity.featured, // ✅ obrigatório pela model
        published: entity.published,
      };
      const linkFn =
        this.audience === "public" ? touristPointPublicLinks : touristPointLinks;
      const builder = new ResourceBuilder(data);
      const resource = builder
        .addAllLinks(linkFn(entity.id))
        .addMeta({ correlationId, version: "1.0.0" })
        .build();

      return ok(resource);
    } catch (error) {
      logger.error("Erro ao buscar ponto turístico", {
        correlationId,
        route: "GetPontoTuristicoByIdController",
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
