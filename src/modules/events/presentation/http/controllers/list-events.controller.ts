// src/modules/events/presentation/http/controllers/list-events.controller.ts
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CollectionResourceBuilder, ok } from "@/core/http/http-resource";
import { ListEventsUseCase } from "@/modules/events/application/use-cases/list-events.usecase";
import { eventListLinks, eventPublicListLinks } from "../event-hateoas";
import { ListEventsDTO } from "@/modules/events/application/dto";
import { EventCategory, isEventCategory } from "@/modules/events/domain/value-objects/event-category";

export type EventsListAudience = "admin" | "public";

type ListEventsQueryParams = {
  page?: string;
  limit?: string;
  name?: string;
  category?: string;
  cityId?: string;
  sortBy?: string;
  sortDir?: string;
};

export class ListEventsController implements Controller {
  constructor(
    private readonly useCase: ListEventsUseCase,
    private readonly audience: EventsListAudience = "admin",
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    const q = (httpRequest.query ?? {}) as ListEventsQueryParams;

    const categoryFilter: EventCategory | undefined =
      q.category !== undefined && isEventCategory(q.category)
        ? q.category
        : undefined;

    const result = await this.useCase.execute({
      page: q.page ? Number(q.page) : undefined,
      limit: q.limit ? Number(q.limit) : undefined,

      name: q.name,
      category: categoryFilter,
      cityId: q.cityId ? Number(q.cityId) : undefined,

      sortBy: q.sortBy,
      sortDir: q.sortDir,
    });

    const data = {
      items: result.items.map<ListEventsDTO>((e) => ({
        id: e.id,
        cityId: e.cityId,
        citySlug: e.citySlug,
        name: e.name,
        description: e.description,
        category: e.category,
        startDate: e.startDate,
        endDate: e.endDate,
        formattedDate: e.formattedDate,
        location: e.location,
        imageUrl: e.imageUrl,
        featured: e.featured,
        published: e.published,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      sort: result.sort,
    };

    const listParams = {
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      filters: {
        ...(q.name !== undefined && { name: q.name }),
        ...(categoryFilter !== undefined && { category: categoryFilter }),
        ...(q.cityId !== undefined && { cityId: q.cityId }),
      },
      sort: q.sortBy ? { by: q.sortBy, dir: q.sortDir as "asc" | "desc" } : undefined,
    };
    const links =
      this.audience === "public"
        ? eventPublicListLinks(listParams)
        : eventListLinks(listParams);

    const meta = {
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      sort: result.sort,
      correlationId,
    };
    const builder = new CollectionResourceBuilder<ListEventsDTO>(data.items);
    const collectionResource = builder.addAllLinks(links).addMeta(meta).build();

    return ok(collectionResource);
  }
}
