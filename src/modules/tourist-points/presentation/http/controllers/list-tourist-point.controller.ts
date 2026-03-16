import { logger } from "@/core/config/logger";
import { buildPaginationLinks } from "@/core/http/hateoas/pagination-links";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";
import { collection, ok } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ListTouristPointsUseCase } from "../../../application/use-cases/list-tourist-points.usecase";

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
        nome: q.nome,
        city: q.city,
        estado: q.estado,
        ativo:
          q.ativo === "true" ? true : q.ativo === "false" ? false : undefined,
        sortBy: q.sortBy,
        sortDir: q.sortDir,
      });

      const data = result.items.map((item: any) => ({
        id: item.id,
        nome: item.nome,
        city: item.city,
        estado: item.estado,
        ativo: item.ativo,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      const links = buildPaginationLinks({
        basePath: "/api/tourist-points",
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
      };

      return ok(collection(data, links, meta));
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
