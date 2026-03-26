// src/database.ts
import { ENV } from "@/core/config/env";
import { logger } from "@/core/config/logger";
import { Dialect, Sequelize } from "sequelize";

const isTest = ENV.NODE_ENV === "test";

const sequelize = isTest
  ? new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    })
  : new Sequelize(ENV.DB_DATABASE, ENV.DB_USERNAME, ENV.DB_PASSWORD, {
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      dialect: ENV.DB_DIALECT as Dialect,
      logging:
        ENV.NODE_ENV === "development" ? (msg) => logger.database(msg) : false,
    });

logger.info("Sequelize instance created", {
  dialect: isTest ? "sqlite" : ENV.DB_DIALECT,
  host: isTest ? "memory" : ENV.DB_HOST,
});

export default sequelize;