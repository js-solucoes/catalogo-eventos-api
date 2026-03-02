import { GetUserByIdUseCase } from "@/modules/users/application/use-cases/get-user-by-id.usecase";
import { FindUserByIdRepository } from "@/modules/users/domain/repositories/find-user-by-id.repository";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";

describe("GetUserByIdUseCase", () => {
  const makeSut = () => {
    const findByIdRepoMock: FindUserByIdRepository = {
      findById: jest.fn(async (id: number) =>
        id === 1
          ? new UserEntity({
              id: 1,
              nome: "User 1",
              email: "user1@example.com",
              senha: "hash1",
              role: "Admin",
            })
          : null
      ),
    };

    const sut = new GetUserByIdUseCase(findByIdRepoMock);

    return { sut, findByIdRepoMock };
  };

  it("deve retornar usuário quando encontrado", async () => {
    const { sut, findByIdRepoMock } = makeSut();

    const result = await sut.execute(1);

    expect(findByIdRepoMock.findById).toHaveBeenCalledWith(1);
    expect(result).not.toBeNull();
    expect(result?.email).toBe("user1@example.com");
  });

  it("deve retornar null quando usuário não existe", async () => {
    const { sut, findByIdRepoMock } = makeSut();

    const result = await sut.execute(999);

    expect(findByIdRepoMock.findById).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });
});