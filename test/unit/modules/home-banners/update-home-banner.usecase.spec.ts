import { UpdateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases/update-home-banner.usecase";
import { HomeBannerEntity } from "@/modules/home-banners/domain/entities/home-banner.entity";
import { UpdateHomeBannerRepository } from "@/modules/home-banners/domain/repositories";

describe("UpdateHomeBannerUseCase", () => {
  it("delega update ao repositório com id do path", async () => {
    const updated = new HomeBannerEntity({
      id: 2,
      title: "T",
      subtitle: "S",
      imageUrl: "https://x.com/i.jpg",
      ctaLabel: "Go",
      ctaUrl: "https://x.com",
      active: true,
      order: 1,
    });
    const repo: UpdateHomeBannerRepository = {
      update: jest.fn(async () => updated),
    };
    const sut = new UpdateHomeBannerUseCase(repo);
    const result = await sut.execute(2, { title: "T" });
    expect(repo.update).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ title: "T" }),
    );
    expect(result).toBe(updated);
  });
});
