import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../mysql/query";
import { INSERT_USER_STATEMENT } from "../mysql/mutation";
import bcrytpt from "bcryptjs";
import { generateJWTToken, saveRefreshToken } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";
import { Connection, PoolConnection } from "mysql2/promise";

const getUserBy = async (by: "email" | "id", value: string) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log(`Executing query for ${by}:`, value);

    const result = await conn.query(
      by === "email" ? GET_USER_BY_EMAIL : GET_USER_BY_ID,
      [value]
    );

    console.log("Query Result:", result);

    //@ts-ignore
    const user = result[0]?.[0];
    console.log("User retrieved:", user);
    return user;
  } catch (error) {
    console.error("Error while retrieving user:", error);
    return null;
  } finally {
    if (conn) conn.release();
  }
};

export const setCookies = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  res.clearCookie("access_token", {
    domain: "localhost",
    httpOnly: true,
    path: "/",
  });

  res.clearCookie("refresh_token", {
    domain: "localhost",
    httpOnly: true,
    path: "/",
  });
  const expiryAccessToken = new Date(new Date().getTime() + 60 * 60 * 1000);
  const expiryRefreshToken = new Date(
    new Date().getTime() + 7 * 24 * 60 * 60 * 1000
  );

  res.cookie("access_token", accessToken, {
    domain: "localhost",
    httpOnly: true,
    path: "/",
    expires: expiryAccessToken,
    sameSite: "lax",
  });

  res.cookie("refresh_token", refreshToken, {
    domain: "localhost",
    httpOnly: true,
    path: "/",
    expires: expiryRefreshToken,
    sameSite: "lax",
  });

  return;
};

const setAuthTokens = async (id: string, email: string, res: Response) => {
  try {
    const accessToken = generateJWTToken(id, email, "access");
    const refreshToken = generateJWTToken(id, email, "refresh");
    const encryptedToken = encryptData(refreshToken);
    await saveRefreshToken(refreshToken, encryptedToken);
    setCookies(accessToken, encryptedToken, res);
  } catch (error) {
    console.log("Error while setting auth tokens");
    throw error;
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await getUserBy("id", id);
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User retrieved", user });
  } catch (error) {
    console.log("Error occurred", error);
    res
      .status(500)
      .json({ message: "Unexpected error occurred, Try again later" });
    throw error;
  }
};
const getUser = async (req: Request, res: Response) => {
  try {
    const id = res.locals.jwtData.id;
    console.log(res.locals.jwtData);

    const user = await getUserBy("id", id);
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User retrieved", user });
  } catch (error) {
    console.log("Error occurred", error);
    res
      .status(500)
      .json({ message: "Unexpected error occurred, Try again later" });
    throw error;
  }
};

const registerUser = async (req: Request, res: Response) => {
  let conn: PoolConnection | null = null;
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ message: "Data missing" });
    }

    const user = await getUserBy("email", email);
    if (user) {
      console.log("User already exists", user);
      return (
        res
          .status(401)
          //@ts-ignore
          .json({ message: `User already exists with id: ${user.id}` })
      );
    }

    const hashedPassword = await bcrytpt.hash(password, 10);
    conn = await pool.getConnection();
    const result = await conn.query(INSERT_USER_STATEMENT, [
      name,
      email,
      hashedPassword,
    ]);
    //@ts-ignore
    const insertId = result[0].insertId as number;
    console.log("User inserted: ", result);
    await setAuthTokens(String(insertId), email, res);

    return res.status(200).json({ message: "User created", user: result[0] });
  } catch (error) {
    console.log("Error occurred", error);
    res
      .status(500)
      .json({ message: "Unexpected error occurred, Try again later" });
    throw error;
  } finally {
    conn && conn.release();
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("no email password");

      return res.status(422).json({ message: "Data missing" });
    }

    const user = await getUserBy("email", email);
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }
    //@ts-ignore
    const isPasswordCorrect = await bcrytpt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Invalid password");

      return res.status(401).json({ message: "Invalid Password" });
    }
    console.log("Setting auth tokens");

    await setAuthTokens(String(user.id), email, res);
    console.log("set auth tokens");

    return res.status(200).json({ message: "User logged in", user });
  } catch (error) {
    console.log("Error occurred", error);
    res
      .status(500)
      .json({ message: "Unexpected error occurred, Try again later" });
    throw error;
  }
};

export { getUser, registerUser, loginUser, getUserById };