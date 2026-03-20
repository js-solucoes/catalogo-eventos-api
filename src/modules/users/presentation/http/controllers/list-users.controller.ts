import { logger } from "@/core/config/logger";
import { serverError } from "@/core/helpers/http-helper";
import { CollectionResourceBuilder, ok } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ListUsersUseCase } from "../../../application/use-cases/list-users.usecase";
import { usersCollectionLinks } from "../user-hateoas";

export class ListUsersController implements Controller {
  constructor(private readonly useCase: ListUsersUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const users = await this.useCase.execute();

      const builder = new CollectionResourceBuilder(users);
      const resourceList = builder
        .addAllLinks(usersCollectionLinks())
        .addMeta({ correlationId, version: "1.0.0" })
        .build();
      return ok(resourceList);
    } catch (error) {
      logger.error("ListUsersController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}
