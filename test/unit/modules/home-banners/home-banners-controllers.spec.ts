import { CreateHomeBannerController } from "@/modules/home-banners/presentation/http/controllers/create-home-banners.controller";
import { DeleteHomeBannerController } from "@/modules/home-banners/presentation/http/controllers/delete-home-banners.controller";
import { FindHomeBannerByIdController } from "@/modules/home-banners/presentation/http/controllers/find-home-banners-by-id.controller";
import { GetHomeBannerController } from "@/modules/home-banners/presentation/http/controllers/get-home-banner.controller";
import { UpdateHomeBannerController } from "@/modules/home-banners/presentation/http/controllers/update-home-banners.controller";

jest.mock("@/core/config/logger", () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const row = {
  id: 1,
  title: "Banner",
  subtitle: "Sub",
  imageUrl: "https://x.png",
  ctaLabel: "Ir",
  ctaUrl: "https://cta",
  active: true,
  order: 0,
};

describe("CreateHomeBannerController", () => {
  const execute = jest.fn();
  const sut = new CreateHomeBannerController({ execute } as never);

  it("201 e erro mapeado", async () => {
    execute.mockResolvedValue(row);
    expect((await sut.handle({ correlationId: "c", body: {} })).statusCode).toBe(
      201,
    );
    execute.mockRejectedValue(new Error("x"));
    expect(
      (await sut.handle({ correlationId: "c", body: {} })).statusCode,
    ).not.toBe(201);
  });
});

describe("GetHomeBannerController", () => {
  const execute = jest.fn();
  const sut = new GetHomeBannerController({ execute } as never);

  it("200 e erro", async () => {
    execute.mockResolvedValue([row]);
    expect((await sut.handle({ correlationId: "c" })).statusCode).toBe(200);
    execute.mockRejectedValue(new Error("x"));
    expect((await sut.handle({ correlationId: "c" })).statusCode).not.toBe(200);
  });
});

describe("FindHomeBannerByIdController", () => {
  const execute = jest.fn();
  const sut = new FindHomeBannerByIdController({ execute } as never);

  it("200, 404 e erro", async () => {
    execute.mockResolvedValue(row);
    expect(
      (await sut.handle({ correlationId: "c", pathParams: { id: "1" } }))
        .statusCode,
    ).toBe(200);
    execute.mockResolvedValue(null);
    expect(
      (await sut.handle({ correlationId: "c", pathParams: { id: "1" } }))
        .statusCode,
    ).toBe(404);
    execute.mockRejectedValue(new Error("x"));
    expect(
      (await sut.handle({ correlationId: "c", pathParams: { id: "1" } }))
        .statusCode,
    ).not.toBe(200);
  });
});

describe("UpdateHomeBannerController", () => {
  const execute = jest.fn();
  const sut = new UpdateHomeBannerController({ execute } as never);

  it("200, 404 e erro", async () => {
    execute.mockResolvedValue(row);
    expect(
      (
        await sut.handle({
          correlationId: "c",
          pathParams: { id: "1" },
          body: { title: "Novo" },
        })
      ).statusCode,
    ).toBe(200);
    execute.mockResolvedValue(null);
    expect(
      (
        await sut.handle({
          correlationId: "c",
          pathParams: { id: "1" },
          body: {},
        })
      ).statusCode,
    ).toBe(404);
    execute.mockRejectedValue(new Error("x"));
    expect(
      (
        await sut.handle({
          correlationId: "c",
          pathParams: { id: "1" },
          body: {},
        })
      ).statusCode,
    ).not.toBe(200);
  });
});

describe("DeleteHomeBannerController", () => {
  const execute = jest.fn();
  const sut = new DeleteHomeBannerController({ execute } as never);

  it("200, 404 e erro", async () => {
    execute.mockResolvedValue(true);
    expect(
      (await sut.handle({ correlationId: "c", pathParams: { id: "1" } }))
        .statusCode,
    ).toBe(200);
    execute.mockResolvedValue(false);
    expect(
      (await sut.handle({ correlationId: "c", pathParams: { id: "1" } }))
        .statusCode,
    ).toBe(404);
    execute.mockRejectedValue(new Error("x"));
    expect(
      (await sut.handle({ correlationId: "c", pathParams: { id: "1" } }))
        .statusCode,
    ).not.toBe(200);
  });
});
