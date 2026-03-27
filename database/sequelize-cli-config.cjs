"use strict";

/**
 * Configuração do sequelize-cli (db:migrate).
 * Carrega o mesmo .env que a aplicação (env.ts), sem duplicar regras de negócio.
 */
const path = require("path");
require("dotenv").config({
  path: [
    path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`),
    path.resolve(process.cwd(), ".env"),
  ],
});

function dialectOptions() {
  const ssl = process.env.DB_SSL === "true";
  if (!ssl) return undefined;
  const rejectUnauthorized =
    process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";
  return {
    ssl: {
      require: true,
      rejectUnauthorized,
    },
  };
}

function base() {
  return {
    username: process.env.DB_USERNAME || "user_app",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_DATABASE || "db_app",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || "mysql",
    dialectOptions: dialectOptions(),
  };
}

module.exports = {
  development: { ...base() },
  production: { ...base() },
  test: { ...base() },
};
