// src/modules/events/infra/model/event-model.ts
import sequelize from "@/core/database";
import { DataTypes, Model } from "sequelize";

class HomeBannerModel extends Model {
  id!: number;
  title!: string;
  subtitle!: string;
  imageUrl!: string;
  ctaLabel!: string;
  active!: string;
  order!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

HomeBannerModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    subtitle: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    ctaLabel: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    tableName: "home-banners",
  },
);

export default HomeBannerModel;
