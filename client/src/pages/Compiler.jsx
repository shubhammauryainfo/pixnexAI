import React, { useContext, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Compiler = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLang = searchParams.get("lang") || "js";
  const [language, setLanguage] = useState(initialLang);
  const [code, setCode] = useState(
    initialLang === "py"
      ? "print(\"Hello from Python\")"
      : initialLang === "java"
        ? "public class Main { public static void main(String[] args) { System.out.println(\"Hello from Java\"); } }"
        : initialLang === "php"
          ? "<?php\necho \"Hello from PHP\";\n"
          : "console.log(\"Hello from JavaScript\");"
  );
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const languageLabel = useMemo(() => {
    if (language === "py") return "Python";
    if (language === "java") return "Java";
    if (language === "php") return "PHP";
    return "JavaScript";
  }, [language]);

  const switchLanguage = (lang) => {
    setLanguage(lang);
    setSearchParams({ lang });
    setResult(null);
    setCode(
      lang === "py"
        ? "print(\"Hello from Python\")"
        : lang === "java"
          ? "public class Main { public static void main(String[] args) { System.out.println(\"Hello from Java\"); } }"
          : lang === "php"
            ? "<?php\necho \"Hello from PHP\";\n"
            : "console.log(\"Hello from JavaScript\");"
    );
  };

  const runCode = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      const res = await fetch(`${backendUrl}/api/utility/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language:
            language === "py"
              ? "python"
              : language === "java"
                ? "java"
                : language === "php"
                  ? "php"
                  : "javascript",
          sourceCode: code,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        toast.error(data.message || "Failed to compile");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsRunning(false);
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
        <h1 className="text-3xl font-semibold mb-2">Code Compiler</h1>
        <p className="text-gray-600">Run JavaScript or Python instantly</p>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => switchLanguage("js")}
            className={`px-4 py-2 rounded-full text-sm ${
              language === "js" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => switchLanguage("py")}
            className={`px-4 py-2 rounded-full text-sm ${
              language === "py" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Python
          </button>
          <button
            onClick={() => switchLanguage("java")}
            className={`px-4 py-2 rounded-full text-sm ${
              language === "java" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Java
          </button>
          <button
            onClick={() => switchLanguage("php")}
            className={`px-4 py-2 rounded-full text-sm ${
              language === "php" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            PHP
          </button>
          <div className="text-sm text-gray-500">Selected: {languageLabel}</div>
        </div>

        <form onSubmit={runCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Code</label>
            <textarea
              className="w-full border rounded-lg p-3 h-56 font-mono text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </form>

        {result && (
          <div className="mt-6 border-t pt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-sm">{result?.status?.description || ""}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Output</p>
              <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
                {result.stdout || result.stderr || result.compile_output || result.message || "(no output)"}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;
