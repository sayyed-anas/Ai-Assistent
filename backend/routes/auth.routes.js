import express from "express";
import { logOut, signIn, signUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.route("/signup").post(signUp);
authRouter.route("/signin").post(signIn);
authRouter.route("/logout").get(logOut);

export default authRouter;
