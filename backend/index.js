import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectToDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import geminiResponse from "./gemini.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
  });
});
