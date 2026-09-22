import "reflect-metadata";
import { DataSource } from "typeorm";
import { Admin } from "@/entities/admin";
import { User } from "@/entities/user";

const dbConnect = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [Admin, User],

  synchronize: true,
  logging: true,
});

export default dbConnect;