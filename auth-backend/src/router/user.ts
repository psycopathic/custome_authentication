import { Router } from "express";
import getUser from "../handler/user-handlers";    

const usersRouter = Router();

//api/v1/auth/user ==> usersRouter

usersRouter.get("/:id",getUser);

export default usersRouter;