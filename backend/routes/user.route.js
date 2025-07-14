import express from "express";
import {
  askToAssistant,
  getCurrentUser,
  updateAssistant,
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.route("/current").get(isAuth, getCurrentUser);
userRouter
  .route("/update")
  .post(isAuth, upload.single("assistantImage"), updateAssistant);
userRouter.route("/asktoassistant").post(isAuth, askToAssistant);

export default userRouter;
