import UserModel from "@/modules/users/infra/model/user-model";
import { userModelToEntity } from "../mappers/user-model.mapper";
import { Transaction } from "sequelize";
import { UserEntity, UserProps } from "../../domain/entities/user.entity";
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
    return userModelToEntity(created);
  }

  async findById(id: number, t?: Transaction): Promise<UserEntity | null> {
    const user = await UserModel.findByPk(id, { transaction: t }  );
    if (!user) return null;

    return userModelToEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return null;

    return userModelToEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await UserModel.findAll();

    return users.map((u) => userModelToEntity(u));
  }

  async update(
    id: number,
    data: Partial<UserProps>,
  ): Promise<UserEntity | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    await user.update({
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      password: data.password ?? user.password,
      role: data.role ?? user.role,
    });

    return userModelToEntity(user);
  }

  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    const deleted = await UserModel.destroy({ where: { id }, transaction });
    return deleted > 0;
  }
}