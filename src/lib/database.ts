import "reflect-metadata";
import { DataSource } from "typeorm";

const dbConnect = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
 entities: [process.cwd() + "/src/entities/*.{ts}"],
  synchronize:true,
  logging:true
});


export async function DBConnect (){

    if(dbConnect.isInitialized){
        return dbConnect
    }

    await dbConnect.initialize()

    console.log("MYSQL is connected")
    return dbConnect

}

export default DBConnect;