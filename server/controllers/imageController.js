import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

// Helper function to check credits
const checkUserCredits = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.creditBalance === 0 || user.creditBalance < 0) {
    return {
      success: false,
      message: "No credit balance",
      creditBalance: user.creditBalance,
    };
  }
  return { success: true, user };
};

// Helper function to deduct credits
const deductCredits = async (userId, currentBalance) => {
  await userModel.findByIdAndUpdate(userId, {
    creditBalance: currentBalance - 1,
  });
  return currentBalance - 1;
};

const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    if (!prompt) {
      return res.json({ success: false, message: "Missing prompt." });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const newBalance = await deductCredits(user._id, user.creditBalance);

    res.json({
      success: true,
      message: "Image generated",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cleanup - Remove unwanted objects from images
const cleanupImage = async (req, res) => {
  try {
    const { userId, imageFile, maskFile } = req.body;

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    if (!imageFile || !maskFile) {
      return res.json({
        success: false,
        message: "Missing image or mask file.",
      });
    }

    const formData = new FormData();
    const imageBuffer = Buffer.from(imageFile.split(",")[1], "base64");
    const maskBuffer = Buffer.from(maskFile.split(",")[1], "base64");

    formData.append("image_file", imageBuffer, "image.png");
    formData.append("mask_file", maskBuffer, "mask.png");

    const { data } = await axios.post(
      "https://clipdrop-api.co/cleanup/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const newBalance = await deductCredits(user._id, user.creditBalance);

    res.json({
      success: true,
      message: "Image cleaned up",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Image Upscaling
const upscaleImage = async (req, res) => {
  try {
    const { userId, imageFile, targetWidth, targetHeight } = req.body;

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    if (!imageFile) {
      return res.json({ success: false, message: "Missing image file." });
    }

    const formData = new FormData();
    const imageBuffer = Buffer.from(imageFile.split(",")[1], "base64");

    formData.append("image_file", imageBuffer, "image.png");
    formData.append("target_width", targetWidth || "2048");
    formData.append("target_height", targetHeight || "2048");

    const { data } = await axios.post(
      "https://clipdrop-api.co/image-upscaling/v1/upscale",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const newBalance = await deductCredits(user._id, user.creditBalance);

    res.json({
      success: true,
      message: "Image upscaled",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Background
const removeBackground = async (req, res) => {
  try {
    const { userId, imageFile } = req.body;

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    if (!imageFile) {
      return res.json({ success: false, message: "Missing image file." });
    }

    const formData = new FormData();
    const imageBuffer = Buffer.from(imageFile.split(",")[1], "base64");

    formData.append("image_file", imageBuffer, "image.png");

    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const newBalance = await deductCredits(user._id, user.creditBalance);

    res.json({
      success: true,
      message: "Background removed",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Text
const removeText = async (req, res) => {
  try {
    const { userId, imageFile } = req.body;

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    if (!imageFile) {
      return res.json({ success: false, message: "Missing image file." });
    }

    const formData = new FormData();
    const imageBuffer = Buffer.from(imageFile.split(",")[1], "base64");

    formData.append("image_file", imageBuffer, "image.png");

    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-text/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const newBalance = await deductCredits(user._id, user.creditBalance);

    res.json({
      success: true,
      message: "Text removed",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Replace Background
const replaceBackground = async (req, res) => {
  try {
    const { userId, imageFile, prompt } = req.body;

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    if (!imageFile || !prompt) {
      return res.json({
        success: false,
        message: "Missing image file or prompt.",
      });
    }

    const formData = new FormData();
    const imageBuffer = Buffer.from(imageFile.split(",")[1], "base64");

    formData.append("image_file", imageBuffer, "image.png");
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/replace-background/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const newBalance = await deductCredits(user._id, user.creditBalance);

    res.json({
      success: true,
      message: "Background replaced",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Uncrop - Extend image beyond its original borders
const uncropImage = async (req, res) => {
  try {
    const { userId, imageFile, extendLeft, extendRight, extendUp, extendDown } =
      req.body;

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    if (!imageFile) {
      return res.json({ success: false, message: "Missing image file." });
    }

    const formData = new FormData();
    const imageBuffer = Buffer.from(imageFile.split(",")[1], "base64");

    formData.append("image_file", imageBuffer, "image.png");
    formData.append("extend_left", extendLeft || "0");
    formData.append("extend_right", extendRight || "0");
    formData.append("extend_up", extendUp || "0");
    formData.append("extend_down", extendDown || "0");

    const { data } = await axios.post(
      "https://clipdrop-api.co/uncrop/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    const newBalance = await deductCredits(user._id, user.creditBalance);

    res.json({
      success: true,
      message: "Image uncropped",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  generateImage,
  cleanupImage,
  upscaleImage,
  removeBackground,
  removeText,
  replaceBackground,
  uncropImage,
};
