import z from "zod";
import { createTouristPointSchema } from "../../presentation/http/validators/tourist-point-schemas";

export type createTouristPointDTO = z.infer<
  typeof createTouristPointSchema
>;
export type updateTouristPointDTO = Partial<createTouristPointDTO>;
