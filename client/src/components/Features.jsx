import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const FeatureCard = ({ icon, title, description, toolId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/tools", { state: { selectedTool: toolId } });
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={handleClick}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow border border-gray-100"
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
            <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                Try now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </motion.div>
    );
};

const Features = () => {
    const features = [
        {
            icon: "🎨",
            title: "Text to Image",
            description: "Generate stunning images from text descriptions using AI",
            toolId: "generate",
        },
        {
            icon: "🧹",
            title: "Cleanup",
            description: "Remove unwanted objects from your images seamlessly",
            toolId: "cleanup",
        },
        {
            icon: "📈",
            title: "Image Upscaling",
            description: "Enhance image quality and resolution with AI",
            toolId: "upscale",
        },
        {
            icon: "✂️",
            title: "Remove Background",
            description: "Automatically remove backgrounds from any image",
            toolId: "remove-bg",
        },
        {
            icon: "📝",
            title: "Remove Text",
            description: "Intelligently remove text from images",
            toolId: "remove-text",
        },
        {
            icon: "🌄",
            title: "Replace Background",
            description: "Replace image backgrounds with AI-generated scenes",
            toolId: "replace-bg",
        },
        {
            icon: "🖼️",
            title: "Uncrop",
            description: "Extend image borders with AI-generated content",
            toolId: "uncrop",
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
                <h2 className="text-4xl font-bold mb-4">AI-Powered Image Tools</h2>
                <p className="text-gray-600 text-lg">
                    Transform your images with our suite of AI tools
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        toolId={feature.toolId}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default Features;
