import { Router } from "express";
import { signIN, signUp, signOut } from "../controllers/auth.controller.js";

const authRouter= Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIN);
authRouter.post('/sign-out', signOut);

export default authRouter;