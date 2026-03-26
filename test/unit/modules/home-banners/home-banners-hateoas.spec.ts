import {
  homeBannerLinks,
  homeBannersCollectionLinks,
} from "@/modules/home-banners/presentation/http/home-banners-hateoas";

describe("home-banners-hateoas", () => {
  it("homeBannerLinks e coleção", () => {
    const links = homeBannerLinks(3);
    expect(links["self"]!.href).toContain("/home-banners/3");
    expect(homeBannersCollectionLinks()["create"]!.method).toBe("POST");
  });
});
