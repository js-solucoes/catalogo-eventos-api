import {
  loginSchema,
  refreshTokenSchema,
  authResponseSchema,
  loginResponseSchema,
} from "@/modules/auth/presentation/http/validators/auth-schemas";

function issueForPath(issues: any[], path: string) {
  return issues.find((i) => (i.path?.[0] ?? "") === path);
}

describe("auth-schemas", () => {
  it("loginSchema deve validar payload válido", () => {
    const result = loginSchema.safeParse({
      email: "user@mail.com",
      senha: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("loginSchema deve falhar com email inválido", () => {
    const result = loginSchema.safeParse({
      email: "invalid",
      senha: "123456",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = issueForPath(result.error.issues, "email");
      expect(issue.message).toBe("O email está no formato incorreto");
    }
  });

  it("loginSchema deve falhar com senha menor que 6", () => {
    const result = loginSchema.safeParse({
      email: "user@mail.com",
      senha: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = issueForPath(result.error.issues, "senha");
      expect(issue.message).toBe("A senha deve ter no minimo 6 caracteres");
    }
  });

  it("loginSchema deve falhar com senha maior que 8", () => {
    const result = loginSchema.safeParse({
      email: "user@mail.com",
      senha: "123456789",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = issueForPath(result.error.issues, "senha");
      expect(issue.message).toBe("A senha deve ter no máximo 8 caracteres");
    }
  });

  it("refreshTokenSchema deve exigir refreshToken", () => {
    const result = refreshTokenSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = issueForPath(result.error.issues, "refreshToken");
      expect(issue.message).toBe("O refresh token é obrigatório");
    }
  });

  it("authResponseSchema deve validar role enum", () => {
    const ok = authResponseSchema.safeParse({
      token: "abc",
      userId: 1,
      role: "Admin",
    });
    expect(ok.success).toBe(true);

    const bad = authResponseSchema.safeParse({
      token: "abc",
      userId: 1,
      role: "Gerente",
    });
    expect(bad.success).toBe(false);
  });

  it("loginResponseSchema deve validar resposta de login", () => {
    const ok = loginResponseSchema.safeParse({
      message: "ok",
      token: "t",
      refreshToken: "rt",
    });
    expect(ok.success).toBe(true);
  });
});
