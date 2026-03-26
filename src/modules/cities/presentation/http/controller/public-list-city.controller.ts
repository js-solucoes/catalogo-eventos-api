import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse, ok, CollectionResourceBuilder } from "@/core/http";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { PublicListCityUsecase } from "@/modules/cities/application/use-cases/public-list-city.usecase";
import { CityEntity } from "@/modules/cities/domain/entities/city.entity";
import { publicCitiesCollectionLinks } from "../city-hateoas";

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

export class PublicListCityController implements Controller {
  constructor(private readonly usecase: PublicListCityUsecase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const cities = (await this.usecase.execute()) ?? [];
      const items = cities.map(cityToJson);
      const builder = new CollectionResourceBuilder(items);
      const resource = builder
        .addAllLinks(publicCitiesCollectionLinks())
        .addMeta({ correlationId, version: "1.0.0" })
        .build();
      return ok(resource);
    } catch (error) {
      logger.error("Erro ao listar cidades (público)", {
        correlationId,
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
