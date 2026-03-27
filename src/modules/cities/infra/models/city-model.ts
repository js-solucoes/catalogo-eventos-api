import sequelize from "@/core/database";
import TouristPointModel from "@/modules/tourist-points/infra/model/tourist-point-model";
import { DataTypes, Model } from "sequelize";

export class CityModel extends Model {
  id!: number;
  name!: string;
  slug!: string;
  state!: string;
  summary!: string;
  description!: string;
  imageUrl!: string;
  published!: boolean;
}

CityModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "cities",
  },
);

export default CityModel;
