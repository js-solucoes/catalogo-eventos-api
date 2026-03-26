import { DomainLogger, NoopDomainLogger } from "@/core/logger";
import { GetHomeBannerRepository } from "../../domain/repositories";

export class GetHomeBannerUseCase {
  constructor(
    private readonly repo: GetHomeBannerRepository,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}
  async execute() {
    return await this.repo.getAll();
  }
}
