import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized. Login again.",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode?.id) {
      return res.json({ success: false, message: "Not authorized. Login again." });
    }

    const user = await userModel.findById(tokenDecode.id);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.json({ success: false, message: "Admin access required." });
    }

    req.body.userId = user._id.toString();
    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
