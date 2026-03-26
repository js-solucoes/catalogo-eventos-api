import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse, ok, ResourceBuilder } from "@/core/http";
import { notFound } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { FindSocialLinkByIdUseCase } from "@/modules/social-links/application/use-cases/find-social-link-by-id.usecase";
import {
  socialLinkAdminLinks,
  socialLinkPublicLinks,
} from "../social-link-hateoas";

export type SocialLinkByIdAudience = "admin" | "public";

export class FindSocialLinkByIdController implements Controller {
  constructor(
    private readonly useCase: FindSocialLinkByIdUseCase,
    private readonly audience: SocialLinkByIdAudience = "admin",
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;
    try {
      const id = Number(httpRequest.pathParams?.id);
      const socialLink = await this.useCase.execute(id);

      if (!socialLink) {
        return notFound({
          error: "SOCIAL_LINK_NOT_FOUND",
          meta: { correlationId },
        });
      }

      const data = {
        id: socialLink.id,
        platform: socialLink.platform,
        label: socialLink.label,
        url: socialLink.url,
        active: socialLink.active,
        order: socialLink.order,
        createdAt: socialLink.createdAt,
        updatedAt: socialLink.updatedAt,
      };

      const linkFn =
        this.audience === "public" ? socialLinkPublicLinks : socialLinkAdminLinks;
      const resource = new ResourceBuilder(data)
        .addAllLinks(linkFn(socialLink.id))
        .addMeta({ correlationId, version: "1.0.0" })
        .build();

      return ok(resource);
    } catch (error) {
      logger.error("FindSocialLinkByIdController: erro ao buscar social link", {
        correlationId,
        error,
      });
      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
