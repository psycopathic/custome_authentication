import { createPool, Pool } from "mysql2/promise";
import { CREATE_USERS_TABLE } from "./table";

let pool: Pool;

const connectToDatabase = async () => {
try {
    console.log("DETAILS", {
      port: +process!.env!.MYSQL_PORT!,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    pool = createPool({
      port: +process!.env!.MYSQL_PORT!,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    await pool.getConnection();
    console.log("Connected to MySQL 🚀🚀");
    await pool.execute(CREATE_USERS_TABLE);
    console.log("Table users created!");
  } catch (error) {
    console.log("Error connecting to MySQL: ", error);
    throw error;
  }
};

export { pool, connectToDatabase };
