import express from "express";
import {
  shortenUrl,
  listUserShortUrls,
  deleteUserShortUrl,
  summarizeText,
  compileCode,
} from "../controllers/utilityController.js";
import userAuth from "../middlewares/auth.js";

const utilityRouter = express.Router();

utilityRouter.get("/ping", (req, res) => {
  res.json({ success: true, message: "utility ok" });
});

utilityRouter.post("/shorten", userAuth, shortenUrl);
utilityRouter.get("/shorten", userAuth, listUserShortUrls);
utilityRouter.delete("/shorten/:id", userAuth, deleteUserShortUrl);
utilityRouter.post("/summarize", userAuth, summarizeText);
utilityRouter.post("/compile", compileCode);

export default utilityRouter;
