import { createPool, Pool } from "mysql2/promise";
import { CREATE_USERS_TABLE } from "./table";

let pool: Pool;

const connectToDatabase = async () => {
  try {
    pool = createPool({
      port: Number(process.env.MYSQL_PORT) || 3306,
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "test",
    });

    // test connection
    await pool.getConnection();

    // create users table
    await pool.execute(CREATE_USERS_TABLE);

    console.log("✅ Database connected successfully");
    console.log("✅ Table 'users' created (if not exists).");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

export { pool, connectToDatabase };
