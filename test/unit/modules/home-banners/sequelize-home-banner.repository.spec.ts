import HomeBannerModel from "@/modules/home-banners/infra/model/home-banners-model";
import { SequelizeHomeBannerRepository } from "@/modules/home-banners/infra/sequelize/sequelize-home-banner.repository";

jest.mock("@/modules/home-banners/infra/model/home-banners-model", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

const row = {
  id: 1,
  title: "T",
  subtitle: "S",
  imageUrl: "https://x.com/i.jpg",
  ctaLabel: "Go",
  ctaUrl: "https://x.com",
  active: true,
  order: 0,
};

describe("SequelizeHomeBannerRepository", () => {
  const repo = new SequelizeHomeBannerRepository();

  beforeEach(() => jest.clearAllMocks());

  it("create", async () => {
    (HomeBannerModel.create as jest.Mock).mockResolvedValue({ ...row });
    const out = await repo.create({
      title: "T",
      subtitle: "S",
      imageUrl: "https://x.com/i.jpg",
      ctaLabel: "Go",
      ctaUrl: "https://x.com",
      active: true,
      order: 0,
    });
    expect(out?.id).toBe(1);
    expect(out?.title).toBe("T");
  });

  it("findById null e encontrado", async () => {
    (HomeBannerModel.findByPk as jest.Mock).mockResolvedValue(null);
    expect(await repo.findById(9)).toBeNull();
    (HomeBannerModel.findByPk as jest.Mock).mockResolvedValue({ ...row });
    expect((await repo.findById(1))?.subtitle).toBe("S");
  });

  it("getAll", async () => {
    (HomeBannerModel.findAll as jest.Mock).mockResolvedValue([{ ...row }]);
    const all = await repo.getAll();
    expect(all?.length).toBe(1);
  });

  it("delete", async () => {
    (HomeBannerModel.destroy as jest.Mock).mockResolvedValue(1);
    expect(await repo.delete(1)).toBe(true);
  });

  it("update null e sucesso", async () => {
    (HomeBannerModel.findByPk as jest.Mock).mockResolvedValue(null);
    expect(await repo.update(1, { title: "X" })).toBeNull();

    const inst = {
      ...row,
      update: jest.fn().mockImplementation(async (data: Record<string, unknown>) => {
        Object.assign(inst, data);
        return inst;
      }),
    };
    (HomeBannerModel.findByPk as jest.Mock).mockResolvedValue(inst);
    const out = await repo.update(1, { title: "Novo" });
    expect(out?.title).toBe("Novo");
  });
});
