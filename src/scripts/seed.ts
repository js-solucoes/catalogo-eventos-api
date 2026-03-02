import { ENV } from "@/core/config/env";
import sequelize from "@/core/database";
import { logger } from "@/core/logger";
import User from "@/modules/users/infra/model/user-model";

(async () => {
    await sequelize.authenticate();
    logger.info("Conexão com o banco de dados estabelecida com sucesso.");

    const exists = await User.findOne({ where: { email: "admin@celeirodoms.org.br" } });
    if (!exists) {
        const bcryptAdapter = new (await import("@/core/adapters/bcrypt-adapter")).BcryptAdapter(ENV.SALT);
        const hashedPassword = await bcryptAdapter.hash(ENV.ADMIN_PASSWORD);
        await User.create({
            name: "Admin",
            email: "admin@celeirodoms.org.br",
            password: hashedPassword,
            role: "admin"
        });
    }
})();