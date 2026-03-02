// tests/factories/user-factory.ts
import User from "@/modules/users/infra/model/user-model";
import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { ENV } from "@/core/config/env";

const encrypter = new BcryptAdapter(ENV.SALT);

export async function makeUser(attrs?: Partial<User>): Promise<User> {
  const senhaCriptografada = await encrypter.hash(attrs?.senha ?? "senha123");
  return User.create({
    nome: attrs?.nome ?? "John Doe",
    email: attrs?.email ?? `john${Date.now()}@dominio.com`,
    senha: senhaCriptografada,
    role: attrs?.role ?? "Admin",
  } as any);
}
