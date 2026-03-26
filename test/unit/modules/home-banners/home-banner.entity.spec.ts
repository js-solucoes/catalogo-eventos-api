import { HomeBannerEntity } from "@/modules/home-banners/domain/entities/home-banner.entity";

describe("HomeBannerEntity", () => {
  it("expõe getters", () => {
    const e = new HomeBannerEntity({
      id: 1,
      title: "T",
      subtitle: "S",
      imageUrl: "https://x.com/b.jpg",
      ctaLabel: "L",
      ctaUrl: "https://x.com",
      active: true,
      order: 2,
    });
    expect(e.id).toBe(1);
    expect(e.title).toBe("T");
    expect(e.subtitle).toBe("S");
    expect(e.imageUrl).toContain("b.jpg");
    expect(e.ctaLabel).toBe("L");
    expect(e.ctaUrl).toBe("https://x.com");
    expect(e.active).toBe(true);
    expect(e.order).toBe(2);
  });
});
