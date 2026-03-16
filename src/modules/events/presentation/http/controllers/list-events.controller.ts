// src/modules/events/presentation/http/controllers/list-events.controller.ts
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ok } from "@/core/http/http-resource";
import { ListEventsUseCase } from "@/modules/events/application/use-cases/list-events.usecase";
import { buildPaginationLinks } from "@/core/http/hateoas/pagination-links";
import { eventListLinks } from "../event-hateoas";
import { ListEventsDTO } from "@/modules/events/application/dto";

export class ListEventsController implements Controller {
  constructor(private readonly useCase: ListEventsUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const q = (req.query ?? {}) as any;

    const result = await this.useCase.execute({
      page: q.page ? Number(q.page) : undefined,
      limit: q.limit ? Number(q.limit) : undefined,

      titulo: q.titulo,
      cat: q.cat,
      cityId: q.cityId ? Number(q.cityId) : undefined,

      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });

    const data = {
      items: result.items.map<ListEventsDTO>((e) => ({
        id: e.id,
        titulo: e.titulo,
        descricao: e.desc,
        dataHora: e.hora,
        categoria: e.cat,
      })),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      sort: result.sort,
    };

    const links = eventListLinks({
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      filters: q.filters,
      sort: q.sortBy ? { by: q.sortBy, dir: q.sortDir } : undefined,
    });

    const meta = {
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      sort: result.sort,
    };

    return ok({ data, links, meta });
  }
}
