import { UpdateHomeBannerUseCase } from "@/modules/home-banners/application/use-cases/update-home-banner.usecase";
import { HomeBannerEntity } from "@/modules/home-banners/domain/entities/home-banner.entity";
import {
  FindHomeBannerByIdRepository,
  UpdateHomeBannerRepository,
} from "@/modules/home-banners/domain/repositories";

const tinyPngB64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

describe("UpdateHomeBannerUseCase", () => {
  const existing = new HomeBannerEntity({
    id: 2,
    title: "Old",
    subtitle: "S",
    imageUrl: "https://cdn.example/public/home-banners/old.png",
    ctaLabel: "Go",
    ctaUrl: "https://x.com",
    active: true,
    order: 1,
  });

  it("delega update ao repositório com id do path", async () => {
    const updated = new HomeBannerEntity({
      id: 2,
      title: "T",
      subtitle: "S",
      imageUrl: "https://cdn.example/public/home-banners/old.png",
      ctaLabel: "Go",
      ctaUrl: "https://x.com",
      active: true,
      order: 1,
    });
    const findById: FindHomeBannerByIdRepository = {
      findById: jest.fn(async (id) => (id === 2 ? existing : null)),
    };
    const repo: UpdateHomeBannerRepository = {
      update: jest.fn(async () => updated),
    };
    const images = {
      replacePublicWebImage: jest.fn(),
    };
    const sut = new UpdateHomeBannerUseCase(findById, repo, images as never);
    const result = await sut.execute(2, { title: "T" });
    expect(repo.update).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ title: "T" }),
    );
    expect(images.replacePublicWebImage).not.toHaveBeenCalled();
    expect(result).toBe(updated);
  });

  it("substitui imagem no S3 quando envia image", async () => {
    const updated = new HomeBannerEntity({
      ...existing,
      imageUrl: "https://cdn.example/public/home-banners/new.png",
      title: "T",
      subtitle: "S",
      ctaLabel: "Go",
      ctaUrl: "https://x.com",
      active: true,
      order: 1,
      id: 2,
    });
    const findById: FindHomeBannerByIdRepository = {
      findById: jest.fn(async (id) => (id === 2 ? existing : null)),
    };
    const repo: UpdateHomeBannerRepository = {
      update: jest.fn(async () => updated),
    };
    const file = { base64: tinyPngB64, mimeType: "image/png" as const };
    const images = {
      replacePublicWebImage: jest
        .fn()
        .mockResolvedValue({ url: updated.imageUrl }),
    };
    const sut = new UpdateHomeBannerUseCase(findById, repo, images as never);
    await sut.execute(2, { image: file });
    expect(images.replacePublicWebImage).toHaveBeenCalledWith(
      existing.imageUrl,
      file,
      "home-banners",
    );
    expect(repo.update).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ imageUrl: updated.imageUrl }),
    );
  });

  it("retorna null quando banner não existe", async () => {
    const findById: FindHomeBannerByIdRepository = {
      findById: jest.fn(async () => null),
    };
    const repo: UpdateHomeBannerRepository = {
      update: jest.fn(),
    };
    const sut = new UpdateHomeBannerUseCase(findById, repo, {} as never);
    expect(await sut.execute(99, { title: "X" })).toBeNull();
    expect(repo.update).not.toHaveBeenCalled();
  });
});
