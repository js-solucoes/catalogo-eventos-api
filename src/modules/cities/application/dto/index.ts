import z from "zod";
import {
  createCitySchema,
  deleteCityParamsSchema,
  getCityParamsSchema,
  listCitiesQuerySchema,
  updateCitySchema,
} from "../../presentation/http/validators/city-schemas";

export type CreateCityDTO = z.infer<typeof createCitySchema>;
export type UpdateCityDTO = z.infer<typeof updateCitySchema>;
export type GetCityParamsDTO = z.infer<typeof getCityParamsSchema>;
export type DeleteCityParamsDTO = z.infer<typeof deleteCityParamsSchema>;
export type ListCitiesQueryDTO = z.infer<typeof listCitiesQuerySchema>;

export interface CityViewModel {
  id: number;
  nome: string;
  uf: string;
  desc: string;
  pontos: TouristPointViewModel[];
}

export interface TouristPointViewModel {
    id: number;
    nome: string;
    tipo: string;
    horario: string;
    img: string;
    desc: string;
}
