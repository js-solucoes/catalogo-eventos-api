import sequelize from "@/core/database";
import CityModel from "@/modules/cities/infra/models/city-model";
import { DataTypes, Model } from "sequelize";

export class TouristPointModel extends Model {
  id!: number;
  nome!: string;
  tipo!: string;
  horario!: string;
  img!: string;
  desc!: string;
  cityId!: number;
  city!: CityModel;
}

TouristPointModel.init(
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
    tipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    horario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cities", // Name of the target model
        key: "id", // Key in the target model that we're referencing
      },
    },
  },
  {
    sequelize,
    modelName: "tourist-points",
  },
);

TouristPointModel.belongsTo(CityModel, {
  foreignKey: "cityId",
  as: "city",
});

export default TouristPointModel;
