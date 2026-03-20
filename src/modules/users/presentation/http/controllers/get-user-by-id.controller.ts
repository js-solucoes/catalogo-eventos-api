import { logger } from "@/core/config/logger";
import { badRequestResource, notFound, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { GetUserByIdUseCase } from "../../../application/use-cases/get-user-by-id.usecase";
import { ok, Resource, ResourceBuilder } from "@/core/http";
import { UserViewModel } from "@/modules/users/application/dto";
import { userLinks } from "../user-hateoas";

export class GetUserByIdController implements Controller {
  constructor(private readonly useCase: GetUserByIdUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const id = Number(httpRequest.params.id);

      if (Number.isNaN(id)) {
        const data = {
          error: {
            code: "INVALID_ID",
            message: "ID inválido",
          },
        };
        const builder = new ResourceBuilder(data);
        const resource = builder
          .addOneLink("list", "GET", "/users")
          .addMeta({ correlationId, version: "1.0.0" })
          .build();
        return badRequestResource(resource);
      }

      const user = await this.useCase.execute(id);

      if (!user) {
        const data = {
          error: {
            code: "USER_NOT_FOUND",
            message: "Usuário não encontrado",
          },
        };
        const builder = new ResourceBuilder(data);
        const resource = builder
          .addOneLink("list", "GET", "/users")
          .addOneLink("create", "POST", "/users")
          .addMeta({ correlationId, version: "1.0.0" })
          .build();
        return notFound(resource);
      }

      const builder = new ResourceBuilder<UserViewModel>(user);
      const resource = builder
        .addAllLinks(userLinks(user.id))
        .addMeta({ correlationId, version: "1.0.0" })
        .build();

      return ok(resource);
    } catch (error) {
      logger.error("GetUserByIdController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}
