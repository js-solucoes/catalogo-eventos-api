// src/modules/events/infra/model/event-model.ts
import sequelize from "@/core/database";
import { DataTypes, Model } from "sequelize";

class HomeHighLightsModel extends Model {
  id!: number;
  type!: string;
  referenceId!: string;
  title!: string;
  description!: string;
  imageUrl!: string;
  CityName!: string;
  ctaUrl!: string;
  active!: string;
  order!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

HomeHighLightsModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false },
    referenceId: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    CityName: { type: DataTypes.STRING, allowNull: false },
    ctaUrl: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    tableName: "home-highlights",
  },
);

export default HomeHighLightsModel;
