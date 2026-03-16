import { registerAuthRoutes } from "@/modules/auth/presentation/http/routes/auth.routes";
import { registerCityRoutes } from "@/modules/cities/presentation/http/routes/city.routes";
import { registerEventRoutes } from "@/modules/events/presentation/http/routes/events.routes";
import { registerMediaRoutes } from "@/modules/media/presentation/http/routes/media.routes";
import { registerTouristPointsRoutes } from "@/modules/tourist-points/presentation/http/routes/tourist-point.routes";
import { registerUserRoutes } from "@/modules/users/presentation/http/routes/user.routes";
import { Express, Router } from "express";

export default function setupRoutes(app: Express): void {
  const router = Router();

  app.use("/api", router);

  // AUTH
  registerAuthRoutes(router);

  // ADMIN
  registerUserRoutes(router);
  registerTouristPointsRoutes(router);
  registerCityRoutes(router);
  registerMediaRoutes(router);
  registerEventRoutes(router);

  // PUBLIC
}
