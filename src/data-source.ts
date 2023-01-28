import "reflect-metadata"
import { DataSource } from "typeorm"
import { NewPixel } from "./entity/NewPixel"
require('dotenv').config()

console.log(process.env.POSTGRES_USER)

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [NewPixel],
    migrations: [],
    subscribers: [],
})