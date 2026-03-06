import express from "express";
import {
  loginUser,
  registerUser,
  userCredits,
  listUsers,
  adminCreateUser,
  adminUpdateCredits,
  adminDeleteUser,
  adminStats,
} from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credits", userAuth, userCredits);

userRouter.get("/admin/users", adminAuth, listUsers);
userRouter.post("/admin/users", adminAuth, adminCreateUser);
userRouter.patch("/admin/users/:id/credits", adminAuth, adminUpdateCredits);
userRouter.delete("/admin/users/:id", adminAuth, adminDeleteUser);
userRouter.get("/admin/stats", adminAuth, adminStats);

export default userRouter;
