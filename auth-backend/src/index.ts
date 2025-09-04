import app from "./app";
import dotenv from "dotenv";
import { connectToDatabase } from "./mysql/connection";
import { initializeRedis } from "./redis/connection";

dotenv.config();

const init = async () => {
  try {
    await connectToDatabase();
    await initializeRedis();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

init();
