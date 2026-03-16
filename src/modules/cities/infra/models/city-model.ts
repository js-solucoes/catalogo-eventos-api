import sequelize from "@/core/database";
import TouristPointModel from "@/modules/tourist-points/infra/model/tourist-point-model";
import { DataTypes, Model } from "sequelize";

export class CityModel extends Model {
  id!: number;
  nome!: string;
  uf!: string;
  desc!: string;
  touristPoint!: TouristPointModel[];
}

CityModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    touristPoint: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("touristPoints") || [];
      },
    },
  },
  {
    sequelize,
    modelName: "cities",
  },
);

export default CityModel;
