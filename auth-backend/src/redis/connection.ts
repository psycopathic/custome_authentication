import { createClient } from "redis";

let redisClient = createClient();

const initializeRedis = async () => {
    try {
        redisClient.on("error", (err) => console.log("Redis Client Error", err));
        await redisClient.connect();
        console.log("✅ Redis connected successfully");
    } catch (error) {
        console.error("❌ Redis connection failed:", error);
        throw error;
    }
};

export { redisClient, initializeRedis };
