import { logger } from "@/core/config/logger";
import { notFound } from "@/core/helpers/http-helper";
import { mapErrorToHttpResponse, ok, ResourceBuilder } from "@/core/http";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { FindCityByIdUseCase } from "@/modules/cities/application/use-cases/find-city-by-id.usecase";
import { CityEntity } from "@/modules/cities/domain/entities/city.entity";
import { adminCityLinks, publicCityByIdLinks } from "../city-hateoas";

function cityToJson(c: CityEntity) {
  return {
    id: c.id,
    name: c.name,
    state: c.state,
    slug: c.slug,
    summary: c.summary,
    description: c.description,
    imageUrl: c.imageUrl,
    published: c.published,
  };
}

export type FindCityByIdAudience = "admin" | "public";

export class FindCityByIdController implements Controller {
  constructor(
    private readonly findCityByIdUseCase: FindCityByIdUseCase,
    private readonly audience: FindCityByIdAudience = "admin",
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const correlationId = request.correlationId;
    try {
      const cityId = Number(request.params?.id);
      const city = await this.findCityByIdUseCase.execute(cityId);
      if (!city) return notFound(city);
      const resourceBuild = new ResourceBuilder(cityToJson(city));
      const resource = resourceBuild
        .addAllLinks(
          this.audience === "public"
            ? publicCityByIdLinks(city.id ?? cityId)
            : adminCityLinks(city.id),
        )
        .addMeta({ correlationId, version: "1.0.0" })
        .build();
      return ok(resource);
    } catch (error) {
      logger.error("Erro ao buscar cidade", {
        correlationId,
        route: "FindCidadeByIdController",
        error,
      });

      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
