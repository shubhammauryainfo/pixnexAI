import axios from "axios";
import userModel from "../models/userModel.js";
import shortUrlModel from "../models/shortUrlModel.js";

const SHORTENER_BASE = "https://linkshrink.dev/api/v1";

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

const deductCredits = async (userId, currentBalance) => {
  await userModel.findByIdAndUpdate(userId, {
    creditBalance: currentBalance - 1,
    $inc: { creditsUsed: 1 },
  });
  return currentBalance - 1;
};

const shortenUrl = async (req, res) => {
  try {
    const { url, customAlias, userId } = req.body;

    if (!url || typeof url !== "string") {
      return res.json({ success: false, message: "URL is required" });
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return res.json({ success: false, message: "URL must start with http or https" });
    }

    const creditCheck = await checkUserCredits(userId);
    if (!creditCheck.success) {
      return res.json(creditCheck);
    }
    const user = creditCheck.user;

    const payload = { url };
    if (customAlias) payload.customAlias = customAlias;

    const { data } = await axios.post(`${SHORTENER_BASE}/shorten`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (data?.status === "success") {
      const created = data.data;
      const newBalance = await deductCredits(user._id, user.creditBalance);

      await shortUrlModel.create({
        userId: user._id,
        originalUrl: created.originalUrl || url,
        shortUrl: created.shortUrl,
        code: created.code,
        deleteToken: created.deleteToken,
      });

      return res.json({ success: true, data: created, creditBalance: newBalance });
    }

    return res.json({ success: false, message: data?.message || "Failed to shorten URL" });
  } catch (error) {
    const message = error?.response?.data?.message || error.message;
    res.json({ success: false, message });
  }
};

const listUserShortUrls = async (req, res) => {
  try {
    const { userId } = req.body;
    const urls = await shortUrlModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .select("_id originalUrl shortUrl code createdAt");
    res.json({ success: true, urls });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteUserShortUrl = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const record = await shortUrlModel.findOne({ _id: id, userId });
    if (!record) {
      return res.json({ success: false, message: "Short URL not found" });
    }

    await axios.delete(
      `${SHORTENER_BASE}/${record.code}?delete_token=${record.deleteToken}`,
    );

    await shortUrlModel.deleteOne({ _id: id, userId });
    res.json({ success: true, message: "Short URL deleted" });
  } catch (error) {
    const message = error?.response?.data?.message || error.message;
    res.json({ success: false, message });
  }
};

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = "deepseek/deepseek-v3.2";
const JUDGE0_BASE = "https://ce.judge0.com";

const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.json({ success: false, message: "Text is required" });
    }

    const words = text.trim().split(/\s+/);
    const limitedText = words.slice(0, 500).join(" ");
    const inputTruncated = words.length > 500;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.json({ success: false, message: "OPENROUTER_API_KEY not set" });
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    const { data } = await axios.post(
      `${OPENROUTER_BASE}/chat/completions`,
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Summarize the user text into concise bullet points. Output only bullets. Max 7 bullets. Keep total under 500 words.",
          },
          { role: "user", content: limitedText },
        ],
        temperature: 0.2,
        max_tokens: 400,
      },
      { headers },
    );

    const content =
      data?.choices?.[0]?.message?.content?.trim() || "";

    let lines = content.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    lines = lines.map((l) => l.replace(/^[-*•]\s*/, ""));
    if (lines.length <= 1 && content) {
      lines = content
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 7);
    }

    const wordCount = lines.join(" ").trim().split(/\s+/).filter(Boolean).length;

    res.json({
      success: true,
      bullets: lines,
      wordCount,
      inputTruncated,
    });
  } catch (error) {
    const message = error?.response?.data?.error?.message
      || error?.response?.data?.message
      || error.message;
    res.json({ success: false, message });
  }
};


const compileCode = async (req, res) => {
  try {
    const { language, sourceCode, stdin } = req.body;

    if (!sourceCode || typeof sourceCode !== "string") {
      return res.json({ success: false, message: "sourceCode is required" });
    }

    const lang = (language || "").toLowerCase();
    let languageId = null;
    if (lang === "javascript" || lang === "js") {
      languageId = 63; // JavaScript (Node.js)
    } else if (lang === "python" || lang === "py") {
      languageId = 71; // Python (3)
    } else if (lang === "java") {
      languageId = 62; // Java
    } else if (lang === "php") {
      languageId = 68; // PHP
    } else {
      return res.json({ success: false, message: "Unsupported language" });
    }

    const { data } = await axios.post(
      `${JUDGE0_BASE}/submissions?base64_encoded=false&wait=true`,
      {
        language_id: languageId,
        source_code: sourceCode,
        stdin: stdin || "",
      },
      { headers: { "Content-Type": "application/json" } },
    );

    if (data?.stdout !== undefined || data?.stderr !== undefined || data?.compile_output !== undefined) {
      return res.json({ success: true, result: data });
    }

    // Fallback if wait=true not supported and only token returned
    if (data?.token) {
      const { data: status } = await axios.get(
        `${JUDGE0_BASE}/submissions/${data.token}?base64_encoded=false&fields=stdout,stderr,compile_output,message,status`,
      );
      return res.json({ success: true, result: status });
    }

    return res.json({ success: false, message: "Unknown response from Judge0" });
  } catch (error) {
    const message = error?.response?.data?.message || error.message;
    res.json({ success: false, message });
  }
};

export {
  shortenUrl,
  listUserShortUrls,
  deleteUserShortUrl,
  summarizeText,
  compileCode,
};
