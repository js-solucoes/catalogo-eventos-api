import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { DeleteSocialLinkUseCase } from "@/modules/social-links/application/use-cases/delete-social-link.usecase";

export class DeleteSocialLinkController implements Controller {
  constructor(private readonly useCase: DeleteSocialLinkUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const id = Number(httpRequest.pathParams?.id);
      const deleted = await this.useCase.execute(id);

      if (!deleted) {
        return notFound({
          error: "SOCIAL_LINK_NOT_FOUND",
          meta: { correlationId },
        });
      }

      return {
        statusCode: 200,
        body: { data: { deleted }, meta: { correlationId } },
      };
    } catch (error) {
      logger.error("DeleteSocialLinkController: erro ao deletar social link", {
        correlationId,
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
