import { created, mapErrorToHttpResponse, resource } from "@/core/http";
import { logger } from "@/core/logger";
import { Controller, HttpRequest } from "@/core/protocols";
import { CreateCityDTO } from "@/modules/cities/application/dto";
import { CreateCityUseCase } from "@/modules/cities/application/use-cases/create-city.usecase";
import { cityLinks } from "../city-hateoas";

export class CreateCityController implements Controller {
  constructor(private readonly createCityUseCase: CreateCityUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<any> {
    const correlationId = httpRequest.correlationId;
    logger.info("Iniciando criação de cidade", {
      correlationId,
      route: "CreateCityController",
      body: httpRequest.body,
    });
    try {
      const body = httpRequest.body as CreateCityDTO;
      const city = await this.createCityUseCase.execute(body);
      const resourceResp = resource(
        {
          id: city.id,
          nome: city.nome,
          uf: city.uf,
          desc: city.desc,
        },
        cityLinks(city.id),
        {
          version: "1.0.0",
        },
      );

      logger.info("Cidade criada com sucesso", {
        correlationId,
        route: "CreateCityController",
        cityId: city.id,
        nome: city.nome,
      });

      return created(resourceResp);
    } catch (error) {
      logger.error("Erro ao criar cidade", {
        correlationId,
        route: "CreateCityController",
        error,
      });

      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}
