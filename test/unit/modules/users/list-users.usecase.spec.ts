import { ListUsersUseCase } from "@/modules/users/application/use-cases/list-users.usecase";
import { ListUsersRepository } from "@/modules/users/domain/repositories/list-users.repository";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";

describe("ListUsersUseCase", () => {
  const makeSut = () => {
    const listRepoMock: ListUsersRepository = {
      findAll: jest.fn(async () => [
        new UserEntity({
          id: 1,
          nome: "User 1",
          email: "user1@example.com",
          senha: "hash1",
          role: "Admin",
        }),
        new UserEntity({
          id: 2,
          nome: "User 2",
          email: "user2@example.com",
          senha: "hash2",
          role: "Admin",
        }),
      ]),
    };

    const sut = new ListUsersUseCase(listRepoMock);

    return { sut, listRepoMock };
  };

  it("deve retornar a lista de usuários vinda do repositório", async () => {
    const { sut, listRepoMock } = makeSut();

    const result = await sut.execute();

    expect(listRepoMock.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);

    const first = result[0]!;
    expect(first.email).toBe("user1@example.com");
  });
});