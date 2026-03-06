import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  FiImage,
  FiScissors,
  FiZap,
  FiTrash2,
  FiType,
  FiRefreshCw,
  FiMaximize2,
  FiLink,
  FiGrid,
  FiTerminal,
  FiCode,
  FiFileText,
  FiMousePointer,
} from "react-icons/fi";

const FeatureCard = ({ label, title, description, toolId, path, icon }) => {
  const navigate = useNavigate();
  const isClickable = Boolean(toolId || path);

  const handleClick = () => {
    if (!isClickable) return;
    if (path) {
      navigate(path);
      return;
    }
    navigate("/tools", { state: { selectedTool: toolId } });
  };

  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${
        isClickable
          ? "cursor-pointer hover:shadow-xl transition-shadow"
          : "cursor-default opacity-80"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold tracking-wide text-gray-500">
          {label}
        </div>
        <div className="text-xl text-gray-700">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
        {isClickable ? "Try now" : "Coming soon"}
        {isClickable && (
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </motion.div>
  );
};

const Features = () => {
  const imageFeatures = [
    {
      label: "IMAGE",
      title: "Text to Image",
      description: "Generate images from text prompts using AI",
      toolId: "generate",
      icon: <FiImage />,
    },
    {
      label: "IMAGE",
      title: "Cleanup",
      description: "Remove unwanted objects from your images",
      toolId: "cleanup",
      icon: <FiTrash2 />,
    },
    {
      label: "IMAGE",
      title: "Image Upscaling",
      description: "Enhance image quality and resolution",
      toolId: "upscale",
      icon: <FiMaximize2 />,
    },
    {
      label: "IMAGE",
      title: "Remove Background",
      description: "Automatically remove backgrounds from any image",
      toolId: "remove-bg",
      icon: <FiScissors />,
    },
    {
      label: "IMAGE",
      title: "Remove Text",
      description: "Remove text from images cleanly",
      toolId: "remove-text",
      icon: <FiType />,
    },
    {
      label: "IMAGE",
      title: "Replace Background",
      description: "Replace backgrounds with AI-generated scenes",
      toolId: "replace-bg",
      icon: <FiRefreshCw />,
    },
    {
      label: "IMAGE",
      title: "Uncrop",
      description: "Extend image borders with AI-generated content",
      toolId: "uncrop",
      icon: <FiZap />,
    },
  ];

  const utilityFeatures = [
    {
      label: "UTILITY",
      title: "URL Shortener",
      description: "Create short, shareable links for any URL",
      path: "/shorten",
      icon: <FiLink />,
    },
    {
      label: "UTILITY",
      title: "QR Code Generator",
      description: "Generate QR codes for links, text, or data",
      path: "/qr",
      icon: <FiGrid />,
    },
    {
      label: "UTILITY",
      title: "Code Compiler",
      description: "Run JavaScript or Python in one workspace",
      path: "/compiler?lang=js",
      icon: <FiTerminal />,
    },
    {
      label: "UTILITY",
      title: "Text Summarizer",
      description: "Summarize long text into concise notes",
      path: "/summarize",
      icon: <FiFileText />,
    },
    {
      label: "UTILITY",
      title: "Mouse and Keyboard Tester",
      description: "Test input responsiveness and key detection",
      path: "/input-tester",
      icon: <FiMousePointer />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">PixnexAI Tools</h2>
        <p className="text-gray-600 text-lg">
          Two categories: image tools and utility tools
        </p>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Image Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageFeatures.map((feature, index) => (
            <FeatureCard
              key={`image-${index}`}
              label={feature.label}
              title={feature.title}
              description={feature.description}
              toolId={feature.toolId}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Utility Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilityFeatures.map((feature, index) => (
            <FeatureCard
              key={`utility-${index}`}
              label={feature.label}
              title={feature.title}
              description={feature.description}
              toolId={feature.toolId}
              path={feature.path}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Features;
