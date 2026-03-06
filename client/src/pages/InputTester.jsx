import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InputTester = () => {
  const navigate = useNavigate();
  const [lastKey, setLastKey] = useState("");
  const [pressedKeys, setPressedKeys] = useState([]);
  const [keyHistory, setKeyHistory] = useState([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState({ left: 0, middle: 0, right: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      setLastKey(key);
      setPressedKeys((prev) => {
        if (prev.includes(key)) return prev;
        return [...prev, key].slice(-10);
      });
      setKeyHistory((prev) => [key, ...prev].slice(0, 12));
    };

    const handleKeyUp = (e) => {
      const key = e.key;
      setPressedKeys((prev) => prev.filter((k) => k !== key));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setClicks((prev) => ({ ...prev, left: prev.left + 1 }));
    } else if (e.button === 1) {
      setClicks((prev) => ({ ...prev, middle: prev.middle + 1 }));
    } else if (e.button === 2) {
      setClicks((prev) => ({ ...prev, right: prev.right + 1 }));
    }
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
        <h1 className="text-3xl font-semibold mb-2">Mouse & Keyboard Tester</h1>
        <p className="text-gray-600">Check input responsiveness and key detection</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Keyboard</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Last key</p>
            <div className="text-2xl font-semibold">{lastKey || "-"}</div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Keys pressed</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {pressedKeys.length === 0 && (
                <span className="text-gray-400">None</span>
              )}
              {pressedKeys.map((key) => (
                <span key={key} className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                  {key}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Recent keys</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {keyHistory.length === 0 && (
                <span className="text-gray-400">No history</span>
              )}
              {keyHistory.map((key, idx) => (
                <span key={`${key}-${idx}`} className="px-3 py-1 rounded-full bg-blue-50 text-sm">
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Mouse</h2>
          <div
            className="border rounded-xl h-56 flex items-center justify-center text-gray-500"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => e.preventDefault()}
          >
            Move and click inside this area
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <div className="text-lg font-semibold">{mouse.x}px, {mouse.y}px</div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Clicks</p>
              <div className="text-sm">
                Left: {clicks.left} | Middle: {clicks.middle} | Right: {clicks.right}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputTester;
