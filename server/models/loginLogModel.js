import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

const loginLogModel =
  mongoose.models.loginLog || mongoose.model("loginLog", loginLogSchema);

export default loginLogModel;
