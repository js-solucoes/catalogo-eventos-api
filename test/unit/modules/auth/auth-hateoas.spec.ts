import {
  loginLinks,
  refreshTokenLinks,
} from "@/modules/auth/presentation/http/auth-hateoas";

describe("auth-hateoas", () => {
  it("loginLinks deve retornar links corretos", () => {
    const links = loginLinks();

    expect(links).toEqual({
      self: { href: "/api/login", method: "POST" },
      refreshToken: { href: "/api/refresh-token", method: "POST" },
      me: { href: "/api/users/me", method: "GET" },
    });
  });

  it("refreshTokenLinks deve retornar links corretos", () => {
    const links = refreshTokenLinks();

    expect(links).toEqual({
      self: { href: "/api/refresh-token", method: "POST" },
      login: { href: "/api/login", method: "POST" },
    });
  });
});
