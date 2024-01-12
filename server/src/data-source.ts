// Update your TypeORM configuration
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "host.docker.internal",
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'ecoyah',
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
})
