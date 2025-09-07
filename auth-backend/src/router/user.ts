//@ts-nocheck
import { Router } from "express";
import * as usersHandler from "../handlers/user-handler";
import { validateAuthTokens } from "../middlewares/jwt-token-validator";
const usersRouter = Router();

//api/v1/auth/user/wqwqwww => usersRouter
usersRouter.get("/me", validateAuthTokens, usersHandler.getUser);

usersRouter.get("/:id", usersHandler.getUserById);

usersRouter.post("/register", usersHandler.registerUser);

usersRouter.post("/login", usersHandler.loginUser);

export default usersRouter;