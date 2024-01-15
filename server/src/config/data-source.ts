// Update your TypeORM configuration
import { DataSource } from "typeorm";

// Entities
import { Item } from "../entities/Item";
import { User } from "../entities/User";

// External imports
import dotenv from "dotenv";

dotenv.config();
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || "postgres";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: "ecoyahdb",
    entities: [ Item, User ],
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
})
