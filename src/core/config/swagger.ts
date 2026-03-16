import merge from "deepmerge";
import path from "path";
import YAML from "yamljs";

const swaggerPath = (...segments: string[]) =>
  path.resolve(__dirname, "..", "docs", "swagger", ...segments);

export function loadSwaggerDocument() {
  
  const base = YAML.load(swaggerPath("base.yaml"));
  const auth = YAML.load(swaggerPath("auth.yaml"));
  const users = YAML.load(swaggerPath("users.yaml"));
  const touristPoints = YAML.load(swaggerPath("tourist-points.yaml"));
  const cities = YAML.load(swaggerPath("cities.yaml"));
  const media = YAML.load(swaggerPath("media.yaml"));
  const events = YAML.load(swaggerPath("events.yaml"));

  const doc = merge.all([base, auth, users, touristPoints, cities, media, events]);

  return doc;
}
