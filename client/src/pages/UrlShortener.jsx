import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UrlShortener = () => {
  const { user, setShowLogin, shortenUrl, listShortUrls, deleteShortUrl } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [url, setUrl] = useState("https://pixnex-ai.vercel.app");
  const [customAlias, setCustomAlias] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!user) {
      setShowLogin(true);
      return;
    }

    setIsGenerating(true);
    try {
      const data = await shortenUrl({
        url: url.trim(),
        customAlias: customAlias.trim() || undefined,
      });
      if (data) {
        setResult(data);
        loadUrls();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Copy failed");
    }
  };

  const loadUrls = async () => {
    if (!user) return;
    setLoading(true);
    const list = await listShortUrls();
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadUrls();
    }
  }, [user]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    const ok = await deleteShortUrl(id);
    if (ok) {
      setItems((prev) => prev.filter((item) => item._id !== id));
    }
    setDeletingId("");
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
        <h1 className="text-3xl font-semibold mb-2">URL Shortener</h1>
        <p className="text-gray-600">Create fast, shareable short links</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Long URL</label>
            <input
              className="w-full border rounded-lg p-3"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Custom Alias (optional)</label>
              <input
                className="w-full border rounded-lg p-3"
                placeholder="my-campaign"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 text-sm text-gray-500 flex items-center">
              Custom alias must be 3-20 chars (letters, numbers, hyphen).
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Short Link"}
          </button>
        </form>

        {result && (
          <div className="mt-8 border-t pt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Short URL</p>
              <div className="flex items-center gap-2">
                <a className="text-blue-600" href={result.shortUrl} target="_blank" rel="noreferrer">
                  {result.shortUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(result.shortUrl)}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Preview</p>
              <a className="text-blue-600" href={result.previewUrl} target="_blank" rel="noreferrer">
                {result.previewUrl}
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Short Links</h2>
            <button
              onClick={loadUrls}
              className="text-xs px-3 py-1 rounded-full bg-gray-100"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {items.length === 0 && !loading && (
            <p className="text-gray-500 text-sm">No links created yet.</p>
          )}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="border rounded-lg p-3">
                <p className="text-xs text-gray-500">Original</p>
                <p className="text-sm break-all">{item.originalUrl}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <a className="text-blue-600 text-sm" href={item.shortUrl} target="_blank" rel="noreferrer">
                    {item.shortUrl}
                  </a>
                  <button
                    onClick={() => copyToClipboard(item.shortUrl)}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-600 text-white disabled:opacity-60"
                    disabled={deletingId === item._id}
                  >
                    {deletingId === item._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlShortener;
