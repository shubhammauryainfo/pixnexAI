import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Description = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-24 p-6 md:px-28"
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Create with PixnexAI
      </h1>
      <p className="text-gray-500 mb-8">Image and utility tools in one workspace</p>
      <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center">
        <img className="w-80 xl:w-96 rounded-lg" src={assets.sample_img_1} />
        <div className="">
          <h2 className="text-3xl font-medium max-w-lg mb-4">
            Image tools and productivity tools together
          </h2>
          <p className="text-gray-600 mb-4">
            Create stunning visuals with AI and keep your daily utilities in
            the same place. PixnexAI brings together image generation, cleanup,
            upscaling, and background tools with features like URL shortener,
            QR code generation, and text summarizer.
          </p>
          <p className="text-gray-600 mb-4">
            Work faster with developer and hardware utilities too: JavaScript
            and Python compiler, plus mouse and keyboard tester. Whether you
            are creating assets or validating tools, everything is centralized
            for a smoother workflow.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Description;
