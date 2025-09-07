import { Router } from "express";
import usersRouter from "./user";
import validationRouter from "./validation";

const appRouter = Router();

//api/v1/auth/user/* => usersRouter
//api/v1/auth/validate/* => validationRouter

appRouter.use("/user", usersRouter);
appRouter.use("/validate", validationRouter);

export default appRouter;