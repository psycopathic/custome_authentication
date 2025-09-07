import express from "express";
import userRouter from "./user.js";
import validationRouter from "./validation.js";

const router = express.Router();

///api/v1/auth/user/* => userRouter
///api/v1/auth/validate/* => validationRouter

router.use("/user", userRouter);
router.use("/validate", validationRouter);

export default router;
