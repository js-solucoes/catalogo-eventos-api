import { DomainLogger, NoopDomainLogger } from "@/core/logger";
import { FindHomeBannerByIdRepository } from "../../domain/repositories";

export class FindHomeBannerByIdUseCase {
  constructor(
    private readonly repo: FindHomeBannerByIdRepository,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}
  async execute(id: number) {
    return await this.repo.findById(id);
  }
}
