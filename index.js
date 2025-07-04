import cors from "cors";
import express from "express";
import authRouter from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public/uploads"));
app.use("api/auth", authRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
