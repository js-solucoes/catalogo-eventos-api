import { CreateHomeHighlightUseCase } from "@/modules/home-highlights/application/use-cases/create-home-highlight.usecase";
import type { CreateHomeHighlightDTO } from "@/modules/home-highlights/application/dto";
import { HomeHighlightEntity } from "@/modules/home-highlights/domain/entities/home-highlight.entity";
import { CreateHomeHighlightRepository } from "@/modules/home-highlights/domain/repositories/create-home-highlight.reposiotry";

describe("CreateHomeHighlightUseCase", () => {
  const dto = {
    type: "custom" as const,
    referenceId: 1,
    title: "Título",
    description: "Descrição longa o suficiente",
    cityName: "Campo Grande",
    imageUrl: "https://example.com/i.jpg",
    ctaUrl: "https://example.com",
    active: true,
    order: 1,
  } satisfies CreateHomeHighlightDTO;

  it("delega create ao repositório", async () => {
    const created = new HomeHighlightEntity({
      id: 1,
      ...dto,
    });
    const repo: CreateHomeHighlightRepository = {
      create: jest.fn(async () => created),
    };
    const sut = new CreateHomeHighlightUseCase(repo);
    const result = await sut.execute(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(created);
  });
});
