import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { DeleteHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";

export class DeleteHomeBannerController implements Controller {
  constructor(private readonly usecase: DeleteHomeBannerUseCase) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const id = Number(httpRequest.pathParams?.id);
      const deleted = await this.usecase.execute(id);
      if (!deleted) {
        return notFound({ error: "HOME_BANNER_NOT_FOUND", meta: { correlationId } });
      }
      return {
        statusCode: 200,
        body: { data: { deleted }, meta: { correlationId } },
      };
    } catch (error) {
      logger.error("DeleteHomeBannerController: erro ao excluir", {
        correlationId,
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
