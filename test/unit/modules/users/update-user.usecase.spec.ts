import { UpdateUserUseCase } from "@/modules/users/application/use-cases/update-user.usecase";
import { FindUserByIdRepository } from "@/modules/users/domain/repositories/find-user-by-id.repository";
import { UpdateUserRepository } from "@/modules/users/domain/repositories/update-user.repository";
import {
  UserEntity,
  UserProps,
} from "@/modules/users/domain/entities/user.entity";
import { Encrypter } from "@/core/interfaces";

describe("UpdateUserUseCase", () => {
  const makeExistingUser = () =>
    new UserEntity({
      id: 1,
      nome: "User 1",
      email: "user1@example.com",
      senha: "old-hash",
      role: "Admin",
    });

  const makeSut = () => {
    const existingUser = makeExistingUser();

    const findByIdRepoMock: FindUserByIdRepository = {
      findById: jest.fn(async (id: number) => (id === 1 ? existingUser : null)),
    };

    const updateRepoMock: UpdateUserRepository = {
      update: jest.fn(
        async (id: number, data: Partial<UserProps>) =>
          new UserEntity({
            id,
            nome: data.nome ?? existingUser.nome,
            email: data.email ?? existingUser.email,
            senha: data.senha ?? existingUser.senha,
            role: data.role ?? existingUser.role,
          })
      ),
    };

    const encrypterMock: Encrypter = {
      hash: jest.fn(async (value: string) => `hashed-${value}`),
      compare: jest.fn(),
    };

    const sut = new UpdateUserUseCase(
      findByIdRepoMock,
      updateRepoMock,
      encrypterMock
    );

    return {
      sut,
      findByIdRepoMock,
      updateRepoMock,
      encrypterMock,
      existingUser,
    };
  };

  it("deve retornar null quando usuário não existe", async () => {
    const { sut, findByIdRepoMock } = makeSut();

    const result = await sut.execute(999, {} as any);

    expect(findByIdRepoMock.findById).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });

  it("deve atualizar campos básicos sem alterar senha quando senha não é enviada", async () => {
    const { sut, updateRepoMock } = makeSut();

    const input = {
      nome: "User 1 Atualizado",
      email: "novo-email@example.com",
      role: "Admin",
    } as any;

    const result = await sut.execute(1, input);

    const [, data] = await (updateRepoMock.update as jest.Mock).mock.calls[0] as [
      number,
      Partial<UserProps>
    ];

    expect(data.nome).toBe("User 1 Atualizado");
    expect(data.email).toBe("novo-email@example.com");
    expect(data.role).toBe("Admin");
    expect(data.senha).toBeUndefined();

    expect(result?.nome).toBe("User 1 Atualizado");
    expect(result?.email).toBe("novo-email@example.com");
    expect(result?.role).toBe("Admin");
  });

  it("deve criptografar nova senha quando enviada", async () => {
    const { sut, encrypterMock, updateRepoMock } = makeSut();

    const input = {
      senha: "nova-senha",
    } as any;

    const result = await sut.execute(1, input);

    expect(encrypterMock.hash).toHaveBeenCalledWith("nova-senha");

    const [, data] = (updateRepoMock.update as jest.Mock).mock.calls[0] as [
      number,
      Partial<UserProps>
    ];

    expect(data.senha).toBe("hashed-nova-senha");
    expect(result?.senha).toBe("hashed-nova-senha");
  });
});