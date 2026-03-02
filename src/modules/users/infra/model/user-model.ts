import sequelize from "@/core/database";
import { DataTypes, Model } from "sequelize";
import { UserRole } from "../../domain/value-objects/user-role";

export class User extends Model {
  id!: number;
  email!: string;
  senha!: string;
  nome!: string;
  role!: UserRole;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin"),
      allowNull: false,
      defaultValue: "Admin",
    },
  },
  {
    sequelize,
    modelName: "Users",
  }
);

export default User;