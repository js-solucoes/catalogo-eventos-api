"use strict";

const bcrypt = require("bcrypt");
const path = require("path");

require("dotenv").config({
  path: [
    path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`),
    path.resolve(process.cwd(), ".env"),
  ],
});

const ADMIN_EMAIL = "admin@celeirodoms.com.br";
/** Mesmo valor usado em make-user-controllers e make-auth-controllers */
const BCRYPT_ROUNDS = 12;

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = process.env.ADMIN_PASSWORD;
    if (password === undefined || password === "") {
      throw new Error(
        "ADMIN_PASSWORD não definida ou vazia. Defina no .env antes de rodar o seed de admin.",
      );
    }

    const dialect = queryInterface.sequelize.getDialect();
    const usersTable = dialect === "postgres" ? '"Users"' : "`Users`";

    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM ${usersTable} WHERE email = :email LIMIT 1`,
      {
        replacements: { email: ADMIN_EMAIL },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    if (existing) return;

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const now = new Date();

    await queryInterface.bulkInsert("Users", [
      {
        email: ADMIN_EMAIL,
        password: hash,
        name: "Administrador",
        role: "Admin",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const [row] = await queryInterface.sequelize.query(
      `SELECT id FROM ${usersTable} WHERE email = :email LIMIT 1`,
      {
        replacements: { email: ADMIN_EMAIL },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    await queryInterface.bulkInsert("admins", [
      {
        userId: row.id,
        name: "Administrador",
        phone: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();
    const usersTable = dialect === "postgres" ? '"Users"' : "`Users`";

    const [row] = await queryInterface.sequelize.query(
      `SELECT id FROM ${usersTable} WHERE email = :email LIMIT 1`,
      {
        replacements: { email: ADMIN_EMAIL },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    if (!row) return;

    await queryInterface.bulkDelete("admins", { userId: row.id });
    await queryInterface.bulkDelete("Users", { email: ADMIN_EMAIL });
  },
};
