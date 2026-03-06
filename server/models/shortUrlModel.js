import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    code: { type: String, required: true },
    deleteToken: { type: String, required: true },
  },
  { timestamps: true }
);

const shortUrlModel =
  mongoose.models.shortUrl || mongoose.model("shortUrl", shortUrlSchema);

export default shortUrlModel;
