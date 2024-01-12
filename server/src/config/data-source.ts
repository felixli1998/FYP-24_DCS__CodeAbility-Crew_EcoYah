// Update your TypeORM configuration
import { DataSource } from "typeorm";

// Entities
import { Item } from "../entities/Item";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: 'postgres',
    password: '0000',
    database: "ecoyahdb",
    entities: [ Item ],
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
})
