import jwt from "jsonwebtoken";
import { setCache } from "../redis/actions";
import { generateRedisKey, generateTTL } from "../utils/helpers";
import { encryptData } from "../encryption";
export const generateJWTToken = (
  id: string,
  email: string,
  tokenType: "access" | "refresh"
) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY!, {
    expiresIn: tokenType === "access" ? "1h" : "7d",
  });
  return token;
};

export const verifyAndDecode = (token: string) => {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, payload) => {
      if (err) {
        console.log("Couldn't verify token");
        rej(err);
      } else {
        console.log("Token verification successful");
        res(payload);
      }
    });
  });
};

export const saveRefreshToken = async (
  token: string,
  encryptedToken: string
) => {
  try {
    const decodedData = jwt.decode(token, { json: true });
    if (!decodedData) throw new Error("Unable to decode token");
    const key = generateRedisKey(decodedData.id);
    const TTL = generateTTL(decodedData.exp!);
    await setCache(key, encryptedToken, TTL);
    console.log("Saved Refresh Token");
  } catch (error) {
    console.log("Error in saving refresh token: ", error);
    throw error;
  }
};