import express from "express";
import {
  generateImage,
  cleanupImage,
  upscaleImage,
  removeBackground,
  removeText,
  replaceBackground,
  uncropImage,
} from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";

const imageRouter = express.Router();

imageRouter.post("/generate-image", userAuth, generateImage);
imageRouter.post("/cleanup", userAuth, cleanupImage);
imageRouter.post("/upscale", userAuth, upscaleImage);
imageRouter.post("/remove-background", userAuth, removeBackground);
imageRouter.post("/remove-text", userAuth, removeText);
imageRouter.post("/replace-background", userAuth, replaceBackground);
imageRouter.post("/uncrop", userAuth, uncropImage);

export default imageRouter;
