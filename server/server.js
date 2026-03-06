import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import utilityRouter from "./routes/utilityRoutes.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: ["https://pixnex-ai.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  }),
);

await connectDB();
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/utility", utilityRouter);
app.get("/", (req, res) => {
  return res.send("API WORKING");
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
