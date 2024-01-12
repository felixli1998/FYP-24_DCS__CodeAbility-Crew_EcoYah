// Update your TypeORM configuration
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: 'postgres',
    password: '0000',
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
})
