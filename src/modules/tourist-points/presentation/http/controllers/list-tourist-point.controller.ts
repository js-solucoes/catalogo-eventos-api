import { logger } from "@/core/config/logger";
import { buildPaginationLinks } from "@/core/http/hateoas/pagination-links";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { CollectionResourceBuilder, Links, ok } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ListTouristPointsUseCase } from "../../../application/use-cases/list-tourist-points.usecase";
import {
  touristPointsCollectionLinks,
  touristPointsPublicCollectionLinks,
} from "../tourist-point-hateoas";

export type TouristPointsListAudience = "admin" | "public";

export class ListTouristPointsController implements Controller {
  constructor(
    private readonly useCase: ListTouristPointsUseCase,
    private readonly audience: TouristPointsListAudience = "admin",
  ) {}

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

      const basePath =
        this.audience === "public"
          ? "/api/public/tourist-points"
          : "/api/admin/tourist-points";

      const paginationLinks = buildPaginationLinks({
        basePath,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        query: {
          name: q.name,
          city: q.city,
          state: q.state,
          published: q.published,
          sortBy: q.sortBy,
          sortDir: q.sortDir,
        },
      });

      const collectionExtras: Links =
        this.audience === "admin"
          ? touristPointsCollectionLinks()
          : touristPointsPublicCollectionLinks();

      const links: Links = {
        ...collectionExtras,
        ...paginationLinks,
      };

      const meta = {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        sort: result.sort,
        correlationId,
      };
      const builder = new CollectionResourceBuilder(data);
      const collectionResource = builder.addAllLinks(links).addMeta(meta).build();

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
