import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const TextSummarizer = () => {
  const { user, setShowLogin, summarizeText } = useContext(AppContext);
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [bullets, setBullets] = useState([]);
  const [inputTruncated, setInputTruncated] = useState(false);

  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!text.trim()) return;

    setIsSummarizing(true);
    const res = await summarizeText(text);
    if (res) {
      setBullets(res.bullets || []);
      setInputTruncated(Boolean(res.inputTruncated));
    }
    setIsSummarizing(false);
  };

  return (
    <div className="py-10">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          Back
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2">Text Summarizer</h1>
        <p className="text-gray-600">Summarize up to 500 words into bullet points</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSummarize} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input Text</label>
            <textarea
              className="w-full border rounded-lg p-3 h-48"
              placeholder="Paste your text here (max 500 words)"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="text-xs text-gray-500 mt-2">
              Word count: {wordCount} / 500
            </div>
          </div>

          <button
            type="submit"
            disabled={isSummarizing}
            className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSummarizing ? "Summarizing..." : "Summarize"}
          </button>
        </form>

        {inputTruncated && (
          <p className="text-xs text-amber-600 mt-4">
            Input was longer than 500 words and has been truncated.
          </p>
        )}

        {bullets.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Summary</h2>
            <ul className="list-disc pl-5 space-y-2">
              {bullets.map((b, i) => (
                <li key={i} className="text-gray-700">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSummarizer;
