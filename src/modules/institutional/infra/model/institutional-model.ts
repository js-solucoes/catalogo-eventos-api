// src/modules/events/infra/model/event-model.ts
import sequelize from "@/core/database";
import { DataTypes, Model } from "sequelize";

class InstitutionalModel extends Model {
  id!: number;
  aboutTitle!: string;
  aboutText!: string;
  whoWeAreTitle!: string;
  WhoWeAreText!: string;
  purposeTitle!: string;
  purposeText!: string;
  mission!: string;
  vision!: string;
  valuesJson!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

InstitutionalModel.init(
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
    tableName: "institutional",
  },
);

export default InstitutionalModel;
