// tests/helpers/auth.ts
import { api } from "./api";
import { makeUser } from "../factories/user-factory";
import { makeAdmin } from "../factories/admin-factory";

export async function seedUserAndLogin({
  email,
  senha = "senha123",
  role = "Admin",
  criarPerfil = true,
}: {
  email?: string;
  senha?: string;
  role?: string;
  criarPerfil?: boolean;
} = {}) {
  const user = await makeUser({ email, senha, role } as any);
  if (criarPerfil && role === "Admin") {
    await makeAdmin(user);
  }

  const resp = await api()
    .post("/api/login")
    .send({ email: user.email, senha });

  // Asserte aqui para falhar cedo se o login quebrar
  expect(resp.status).toBe(200);
  expect(resp.type).toMatch(/json/);
  expect(resp.body.data).toHaveProperty("accessToken");

  return { user, token: resp.body.data.accessToken };
}
