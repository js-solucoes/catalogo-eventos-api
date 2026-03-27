// src/config/app.ts
import { setupErrorHandlers } from "@/core/http/middlewares";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { ENV } from "@/core/config/env";
import { loadSwaggerDocument } from "./swagger";
import setupMiddlewares from "@/core/config/middlewares";
import { resolveRuntimePath } from "@/core/config/paths";
import setupRoutes from "@/core/config/routes";
import { runReadinessCheck } from "@/core/config/readiness";

export const createApp = (): Application => {
  const app = express();

  // Health check para ALB/ECS (sem tocar no banco)
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  // Readiness: opcionalmente valida banco (target group / ECS health “advanced”)
  app.get("/ready", async (_req, res) => {
    const result = await runReadinessCheck();
    if (result.ok) {
      res.status(200).json({
        status: "ready",
        dbChecked: result.dbChecked,
      });
      return;
    }
    res.status(503).json({
      status: "not_ready",
      error: result.message,
    });
  });

  // Swagger opcional
  if (ENV.SWAGGER_ENABLED) {
    const swaggerDocument = loadSwaggerDocument();

    // Redireciona raiz para /api-docs
    app.get("/", (_req, res) => res.redirect("/api-docs"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    app.get("/", (_req, res) => res.status(204).end());
  }

  // Middlewares globais (incluindo CORS, JSON parser, security headers, etc.)
  setupMiddlewares(app);

  // Rotas da aplicação
  setupRoutes(app);

  // Error handlers devem SEMPRE ser os últimos
  setupErrorHandlers(app);

  return app;
};

// compatibilidade com o que você já usa hoje (default import)
const app = createApp();
export default app;