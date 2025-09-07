//@ts-nocheck
import { Router } from "express";
import { validateAuthMiddleware } from "../middlewares/auth.middleware";

const validationRouter = Router();
validationRouter.put("/tokens", validateAuthMiddleware);

export default validationRouter;