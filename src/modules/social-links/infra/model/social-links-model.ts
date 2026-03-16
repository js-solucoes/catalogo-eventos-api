// src/modules/events/infra/model/event-model.ts
import sequelize from "@/core/database";
import { DataTypes, Model } from "sequelize";

class SocialMediaLinksModel extends Model {
  id!: number;
  platform!: string;
  label!: string;
  url!: string;
  active!: string;
  order!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

SocialMediaLinksModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    aboutTitle: { type: DataTypes.STRING, allowNull: false },
    aboutText: { type: DataTypes.STRING, allowNull: false },
    whoWeAreTitle: { type: DataTypes.STRING, allowNull: false },
    WhoWeAreText: { type: DataTypes.STRING, allowNull: false },
    purposeTitle: { type: DataTypes.STRING, allowNull: false },
    purposeText: { type: DataTypes.STRING, allowNull: false },
    mission: { type: DataTypes.STRING, allowNull: false },
    vision: { type: DataTypes.STRING, allowNull: false },
    valuesJson: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    tableName: "social-media-links",
  },
);

export default SocialMediaLinksModel;
