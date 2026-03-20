import { logger } from "@/core/config/logger";
import {
  badRequestResource,
  notFound,
  serverError,
} from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateUserDTO, UserViewModel } from "@/modules/users/application/dto";
import { UpdateUserUseCase } from "../../../application/use-cases/update-user.usecase";
import { ok, ResourceBuilder } from "@/core/http";
import { userLinks } from "../user-hateoas";

export class UpdateUserController implements Controller {
  constructor(private readonly useCase: UpdateUserUseCase) {}

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

      const body = httpRequest.body as UpdateUserDTO;

      const updated = await this.useCase.execute(id, body);

      if (!updated) {
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

      const builder = new ResourceBuilder<UserViewModel>(updated);
      const resource = builder
        .addAllLinks(userLinks(updated.id))
        .addMeta({ correlationId, version: "1.0.0" })
        .build();

      return ok(resource);
    } catch (error) {
      logger.error("UpdateUserController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}
