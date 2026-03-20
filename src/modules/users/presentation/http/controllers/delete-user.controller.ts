import { logger } from "@/core/config/logger";
import {
  badRequestResource,
  notFound,
  serverError,
} from "@/core/helpers/http-helper";
import { noContent, ResourceBuilder } from "@/core/http";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { DeleteUserUseCase } from "../../../application/use-cases/delete-user.usecase";

export class DeleteUserController implements Controller {
  constructor(private readonly useCase: DeleteUserUseCase) {}

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

      const deleted = await this.useCase.execute(id);

      if (!deleted) {
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

      logger.info("DeleteUserController: usuário deletado", { id });

      return noContent();
    } catch (error) {
      logger.error("DeleteUserController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}
