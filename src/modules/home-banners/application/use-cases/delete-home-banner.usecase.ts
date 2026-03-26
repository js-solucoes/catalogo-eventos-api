import { DomainLogger, NoopDomainLogger } from "@/core/logger";
import { DeleteHomeBannerRepository } from "../../domain/repositories";

export class DeleteHomeBannerUseCase {
  constructor(
    private readonly repo: DeleteHomeBannerRepository,
    private readonly logger: DomainLogger = new NoopDomainLogger(),
  ) {}
  async execute(id: number) {
    return await this.repo.delete(id);
  }
}
