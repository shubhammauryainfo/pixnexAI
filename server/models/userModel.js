import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    creditBalance: {type: Number, default: 5},
    creditsUsed: {type: Number, default: 0},
    lastLoginAt: {type: Date, default: null},
    loginCount: {type: Number, default: 0}
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;
