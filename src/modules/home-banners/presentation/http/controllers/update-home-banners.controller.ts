import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases";
import { mapErrorToHttpResponse } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { logger } from "@/core/config/logger";
import { UpdateHomeBannerDTO } from "@/modules/home-banners/application/dto";

export class UpdateHomeBannerController implements Controller {
  constructor(private readonly usecase: UpdateHomeBannerUseCase) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const homeBanner = httpRequest.body as UpdateHomeBannerDTO;
      const id = Number(httpRequest.pathParams?.id);
      const result = await this.usecase.execute(id, homeBanner);
      if (!result) {
        return notFound({ error: "HOME_BANNER_NOT_FOUND", meta: { correlationId } });
      }
      return {
        statusCode: 200,
        body: { data: result, meta: { correlationId } },
      };
    } catch (error) {
      logger.error("UpdateHomeBannerController: erro ao atualizar", {
        correlationId,
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
