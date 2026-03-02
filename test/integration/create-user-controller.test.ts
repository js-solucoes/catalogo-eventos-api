// tests/integration/create-user.controller.int.spec.ts
import { api } from "../helpers/api";
import { seedUserAndLogin } from "../helpers/auth";
import { closeDb, resetDb, syncDb } from "../helpers/db";

describe("CreateUserController (integration)", () => {
  let token: string;

  beforeAll(async () => {
    await syncDb();
  });

  beforeEach(async () => {
    await resetDb();
    const auth = await seedUserAndLogin(); // cria user+perfil e loga
    token = auth.token;
  });

  afterAll(async () => {
    await closeDb();
  });

  it("deve criar um usuário com sucesso", async () => {
    const resp = await api().withAuth(api().post("/api/usuarios"), token).send({
      nome: "John Doe",
      email: "jhondoe123@dominio.com",
      senha: "senha123",
      role: "Admin",
    });

    expect(resp.status).toBe(201); // se sua API retorna 201
    expect(resp.type).toMatch(/json/);
    expect(resp.body.data).toHaveProperty("id");
    expect(resp.body.data).toMatchObject({
      nome: "John Doe",
      email: "jhondoe123@dominio.com",
      role: "Admin",
    });
  });

  it("não deve criar usuário sem autenticação", async () => {
    const resp = await api().post("/api/usuarios").send({
      nome: "John Doe",
      email: "jhondoe123@dominio.com",
      senha: "senha123",
      role: "Admin",
    });
    expect(resp.status).toBe(401);
    expect(resp.type).toMatch(/json/);
    expect(resp.body).toMatchObject({
      error: {
        code: "UNAUTHORIZED",
        message: "Credenciais ausentes ou inválidas",
      },
    });
    expect(resp.body.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rel: "login", method: "POST" }),
      ]),
    );
  });

  it("não deve criar usuário com dados inválidos", async () => {
    // ARRANGE
    const dadosInvalidos = {
      nome: "Jo", // muito curto
      email: "emailinvalido", // formato inválido
      senha: "123", // muito curto
      role: "Administrador", // valor inválido
    };
    // ACT
    const resp = await api()
      .withAuth(api().post("/api/usuarios"), token)
      .send(dadosInvalidos);
    // ASSERT
    expect(resp.status).toBe(400);
    expect(resp.type).toMatch(/json/);
    expect(resp.body).toEqual({
      errors: [
        {
          message: "Nome deve ter pelo menos 3 caracteres",
          path: "nome",
        },
        { message: "Email deve ser uma string", path: "email" },
        { message: "Senha deve ter pelo menos 6 caracteres", path: "senha" },
        {
          message: "A Role Administrador é inválida",
          path: "role",
        },
      ],
      message: "Validation error",
    });
  });

  it("não deve criar usuário sem dados obrigatórios", async () => {
    const dadosFaltando = {}; // nenhum campo fornecido
    const resp = await api()
      .withAuth(api().post("/api/usuarios"), token)
      .send(dadosFaltando);
    expect(resp.status).toBe(400);
    expect(resp.type).toMatch(/json/);
    expect(resp.body).toEqual({
      errors: [
        { message: "Nome é obrigatório", path: "nome" },
        { message: "Email é obrigatório", path: "email" },
        { message: "Senha é obrigatória", path: "senha" },
        {
          message: "A Role undefined é inválida",
          path: "role",
        },
      ],
      message: "Validation error",
    });
  });

  it("não deve criar usuário com email já existente", async () => {
    // 1ª criação
    const first = await api()
      .withAuth(api().post("/api/usuarios"), token)
      .send({
        nome: "Jane Doe",
        email: "jhondoe123@dominio.com",
        senha: "senha123",
        role: "Admin",
      });
    expect(first.status).toBe(201);

    // 2ª criação (duplicada)
    const dup = await api().withAuth(api().post("/api/usuarios"), token).send({
      nome: "Outra Pessoa",
      email: "jhondoe123@dominio.com",
      senha: "senha123",
      role: "Admin",
    });

    expect(dup.status).toBe(409);
    expect(dup.type).toMatch(/json/);
    expect(dup.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({ code: "EMAIL_ALREADY_IN_USE" }),
      }),
    );
  });
});
