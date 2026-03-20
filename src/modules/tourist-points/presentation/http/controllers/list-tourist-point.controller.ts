import { logger } from "@/core/config/logger";
import { buildPaginationLinks } from "@/core/http/hateoas/pagination-links";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { collection, CollectionResourceBuilder, ok } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ListTouristPointsUseCase } from "../../../application/use-cases/list-tourist-points.usecase";
import { touristPointsCollectionLinks } from "../tourist-point-hateoas";

export class ListTouristPointsController implements Controller {
  constructor(private readonly useCase: ListTouristPointsUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const correlationId = req.correlationId;
    const q = (req.query ?? {}) as any;

    logger.info("Listando pontos turísticos", {
      correlationId,
      route: "ListTouristPointsController",
      query: q,
    });

    try {
      const result = await this.useCase.execute({
        page: q.page,
        limit: q.limit,
        name: q.name,
        city: q.city,
        state: q.state,
        published:
          q.published === "true" ? true : q.published === "false" ? false : undefined,
        sortBy: q.sortBy,
        sortDir: q.sortDir,
      });

      const data = result.items.map((item: any) => ({
        id: item.id,
        cityId: item.cityId,
        citySlug: item.citySlug,
        name: item.name,
        description: item.description,
        category: item.category,
        address: item.address,
        openingHours: item.openingHours,
        imageUrl: item.imageUrl,
        featured: item.featured, // ✅ obrigatório pela model
        published: item.published,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      const links = buildPaginationLinks({
        basePath: "/api/admin/tourist-points",
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        query: {
          nome: q.nome,
          city: q.city,
          estado: q.estado,
          ativo: q.ativo,
          sortBy: q.sortBy,
          sortDir: q.sortDir,
        },
      });

      const meta = {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        sort: result.sort,
        correlationId
      };
      const builder = new CollectionResourceBuilder(data)
      const collectionResource = builder.addAllLinks(touristPointsCollectionLinks()).addMeta(meta).build()

      return ok(collectionResource);
    } catch (error) {
      logger.error("Erro ao listar pontos turísticos", {
        correlationId,
        route: "ListPontosTuristicosController",
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
