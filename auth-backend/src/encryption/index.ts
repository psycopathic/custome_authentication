import crypto from "crypto";
import { config } from "dotenv";
config();

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");
const iv = crypto.randomBytes(16);
const algorithm = "aes-256-cbc";

export const encryptData = (data: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptData = (encrypted: string) => {
  const decripher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decripher.update(encrypted, "hex", "utf8");
  decrypted += decripher.final("utf8");
  return decrypted;
};