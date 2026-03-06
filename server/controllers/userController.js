import userModel from "../models/userModel.js";
import loginLogModel from "../models/loginLogModel.js";
import shortUrlModel from "../models/shortUrlModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name: name,
      email: email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token: token,
      user: { name: user.name, role: user.role, email: user.email, id: user._id },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      await userModel.findByIdAndUpdate(user._id, {
        lastLoginAt: new Date(),
        $inc: { loginCount: 1 },
      });
      await loginLogModel.create({
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        ip: req.ip || "",
      });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token: token,
        user: { name: user.name, role: user.role, email: user.email, id: user._id },
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "_id name email creditBalance role");
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role, creditBalance } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const safeRole = role === "admin" ? "admin" : "user";
    const safeCreditBalance =
      typeof creditBalance === "number"
        ? Math.min(15, Math.max(0, creditBalance))
        : undefined;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    };

    if (safeCreditBalance !== undefined) {
      userData.creditBalance = safeCreditBalance;
    }

    const newUser = new userModel(userData);
    const user = await newUser.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminUpdateCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;

    if (typeof credits !== "number") {
      return res.json({ success: false, message: "Credits must be a number" });
    }
    if (credits > 15) {
      return res.json({ success: false, message: "Max credits limit is 15" });
    }
    if (credits < 0) {
      return res.json({ success: false, message: "Credits cannot be negative" });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      { creditBalance: credits },
      { new: true }
    ).select("_id name email creditBalance role");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalCreditsUsedAgg = await userModel.aggregate([
      { $group: { _id: null, total: { $sum: "$creditsUsed" } } },
    ]);
    const totalCreditsUsed = totalCreditsUsedAgg[0]?.total || 0;
    const totalShortLinks = await shortUrlModel.countDocuments();
    const recentLogins = await loginLogModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select("name email role createdAt ip");

    res.json({
      success: true,
      stats: { totalUsers, totalCreditsUsed, totalShortLinks },
      recentLogins,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  userCredits,
  listUsers,
  adminCreateUser,
  adminUpdateCredits,
  adminDeleteUser,
  adminStats,
};
