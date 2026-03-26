import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateSocialLinkDTO } from "@/modules/social-links/application/dto";
import { UpdateSocialLinkUseCase } from "@/modules/social-links/application/use-cases/update-social-link.usecase";

export class UpdateSocialLinkController implements Controller {
  constructor(private readonly useCase: UpdateSocialLinkUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const id = Number(httpRequest.pathParams?.id);
      const body = httpRequest.body as UpdateSocialLinkDTO;
      const updated = await this.useCase.execute(id, body);

      if (!updated) {
        return notFound({
          error: "SOCIAL_LINK_NOT_FOUND",
          meta: { correlationId },
        });
      }

      return {
        statusCode: 200,
        body: { data: updated, meta: { correlationId } },
      };
    } catch (error) {
      logger.error("UpdateSocialLinkController: erro ao atualizar social link", {
        correlationId,
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
