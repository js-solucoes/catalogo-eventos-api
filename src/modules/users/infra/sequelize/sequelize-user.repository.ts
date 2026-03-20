import UserModel from "@/modules/users/infra/model/user-model";
import { Transaction } from "sequelize";
import { UserEntity } from "../../domain/entities/user.entity";
import {
  CreateUserRepository,
  DeleteUserRepository,
  FindUserByEmailRepository,
  FindUserByIdRepository,
  ListUsersRepository,
  UpdateUserRepository,
} from "../../domain/repositories";
import { FindClienteByTelefoneRepository } from "../../domain/repositories/find-cliente-by-telefone.repository";

export class SequelizeUserRepository
  implements
    CreateUserRepository,
    FindUserByIdRepository,
    FindUserByEmailRepository,
    ListUsersRepository,
    UpdateUserRepository,
    DeleteUserRepository,
    FindClienteByTelefoneRepository
{
  findByTelefone(telefone: string): Promise<{ userId: number; name?: string; endereco?: string; telefone?: string; } | null> {
    return UserModel.findOne({ where: { telefone } }).then(user => {
      if (!user) return null;
      return {
        userId: user.id,
        name: user.name,
        endereco: "Endereço não informado",
        telefone: "Telefone não informado",
      };
    });
  }
  async create(user: UserEntity, t?: Transaction): Promise<UserEntity> {
    const created = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    }, { transaction: t });

    await UserModel.sync();
    return new UserEntity({
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
      role: created.role,
    });
  }

  async findById(id: number, t?: Transaction): Promise<UserEntity | null> {
    const user = await UserModel.findByPk(id, { transaction: t }  );
    if (!user) return null;

    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return null;

    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await UserModel.findAll();

    return users.map(
      (u) =>
        new UserEntity({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
        })
    );
  }

  async update(
    id: number,
    data: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    await user.update({
      name: (data as any)?.name ?? user.name,
      email: (data as any)?.email ?? user.email,
      password: (data as any)?.password ?? user.password,
      role: (data as any)?.role ?? user.role,
    });

    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
  }

  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    const deleted = await UserModel.destroy({ where: { id }, transaction });
    return deleted > 0;
  }
}