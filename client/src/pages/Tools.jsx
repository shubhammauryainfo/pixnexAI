import React, { useContext, useState, useEffect } from "react";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";

const Tools = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [selectedTool, setSelectedTool] = useState("");
    const [prompt, setPrompt] = useState("");
    const [maskImage, setMaskImage] = useState(null);
    const [dimensions, setDimensions] = useState({ width: "2048", height: "2048" });
    const [uncropValues, setUncropValues] = useState({ left: "0", right: "0", up: "0", down: "0" });

    const {
        cleanupImage,
        upscaleImage,
        removeBackgroundImage,
        removeTextImage,
        replaceBackgroundImage,
        uncropImage,
        user,
        setShowLogin
    } = useContext(AppContext);

    const navigate = useNavigate();

    // Set tool from navigation state if provided
    useEffect(() => {
        if (location.state?.selectedTool) {
            const toolId = location.state.selectedTool;
            if (toolId === "generate") {
                navigate("/result");
            } else {
                setSelectedTool(toolId);
            }
        }
    }, [location.state, navigate]);

    const tools = [
        { id: "cleanup", name: "Cleanup", desc: "Remove unwanted objects", requiresMask: true },
        { id: "upscale", name: "Image Upscaling", desc: "Enhance image quality", requiresDimensions: true },
        { id: "remove-bg", name: "Remove Background", desc: "Remove image background" },
        { id: "remove-text", name: "Remove Text", desc: "Remove text from images" },
        { id: "replace-bg", name: "Replace Background", desc: "Replace with new background", requiresPrompt: true },
        { id: "uncrop", name: "Uncrop", desc: "Extend image borders", requiresUncrop: true },
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                setResultImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMaskUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setMaskImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setShowLogin(true);
            return;
        }

        if (!image) {
            alert("Please upload an image");
            return;
        }

        setLoading(true);
        let result = null;

        try {
            switch (selectedTool) {
                case "cleanup":
                    if (!maskImage) {
                        alert("Please upload a mask image");
                        setLoading(false);
                        return;
                    }
                    result = await cleanupImage(image, maskImage);
                    break;
                case "upscale":
                    result = await upscaleImage(image, dimensions.width, dimensions.height);
                    break;
                case "remove-bg":
                    result = await removeBackgroundImage(image);
                    break;
                case "remove-text":
                    result = await removeTextImage(image);
                    break;
                case "replace-bg":
                    if (!prompt) {
                        alert("Please enter a background description");
                        setLoading(false);
                        return;
                    }
                    result = await replaceBackgroundImage(image, prompt);
                    break;
                case "uncrop":
                    result = await uncropImage(image, uncropValues);
                    break;
                default:
                    alert("Please select a tool");
                    setLoading(false);
                    return;
            }

            if (result) {
                setResultImage(result);
            }
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-h-[90vh] py-10"
        >
            <div className="text-center mb-10">
                <h1 className="text-4xl font-semibold mb-2">AI Image Tools</h1>
                <p className="text-gray-600">Select a tool and upload your image</p>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Tool Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {tools.map((tool) => (
                        <div
                            key={tool.id}
                            onClick={() => {
                                setSelectedTool(tool.id);
                                setResultImage(null);
                            }}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTool === tool.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 hover:border-blue-300"
                                }`}
                        >
                            <h3 className="font-semibold mb-1">{tool.name}</h3>
                            <p className="text-sm text-gray-600">{tool.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Upload and Process Form */}
                {selectedTool && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                />
                            </div>

                            {/* Mask Upload for Cleanup */}
                            {selectedTool === "cleanup" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Upload Mask Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMaskUpload}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        White areas will be removed, black areas will be kept
                                    </p>
                                </div>
                            )}

                            {/* Prompt for Replace Background */}
                            {selectedTool === "replace-bg" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Background Description</label>
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., beach sunset, mountain landscape"
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                            )}

                            {/* Dimensions for Upscale */}
                            {selectedTool === "upscale" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Target Width (px)</label>
                                        <input
                                            type="number"
                                            value={dimensions.width}
                                            onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Target Height (px)</label>
                                        <input
                                            type="number"
                                            value={dimensions.height}
                                            onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Uncrop Values */}
                            {selectedTool === "uncrop" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Extend Left (px)</label>
                                        <input
                                            type="number"
                                            value={uncropValues.left}
                                            onChange={(e) => setUncropValues({ ...uncropValues, left: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Extend Right (px)</label>
                                        <input
                                            type="number"
                                            value={uncropValues.right}
                                            onChange={(e) => setUncropValues({ ...uncropValues, right: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Extend Up (px)</label>
                                        <input
                                            type="number"
                                            value={uncropValues.up}
                                            onChange={(e) => setUncropValues({ ...uncropValues, up: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Extend Down (px)</label>
                                        <input
                                            type="number"
                                            value={uncropValues.down}
                                            onChange={(e) => setUncropValues({ ...uncropValues, down: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Preview Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {image && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Original Image</p>
                                        <img src={image} alt="Original" className="w-full rounded-lg border" />
                                    </div>
                                )}
                                {resultImage && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Processed Image</p>
                                        <img src={resultImage} alt="Result" className="w-full rounded-lg border" />
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {loading ? "Processing..." : "Process Image (1 Credit)"}
                            </button>

                            {/* Download Button */}
                            {resultImage && (
                                <a
                                    href={resultImage}
                                    download={`${selectedTool}-result.png`}
                                    className="block w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                                >
                                    Download Result
                                </a>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </motion.div>
    );
};

export default Tools;
