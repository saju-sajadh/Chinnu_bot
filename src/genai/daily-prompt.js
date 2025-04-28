import React from "react";
import { Comic_Neue } from "next/font/google";
import { moralValues } from "@/libs/utils";
import Image from "next/image";
import { motion } from "framer-motion";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const DailyMoralValue = () => {
  const getDailyIndex = () => {
    const startDate = new Date("2025-01-01T06:00:00");
    const now = new Date();
    const diffInMs = now - startDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays % moralValues.length;
  };

  const dailyValue = moralValues[getDailyIndex()];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 0.8, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className={`flex flex-col items-center gap-4 p-6 rounded-3xl ${comicNeue.className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={imageVariants}>
        <Image
          src="/logos/cvp3.png"
          alt="CVP Logo"
          width={200}
          height={200}
          quality={100}
          className="opacity-80"
        />
      </motion.div>
      <motion.div variants={textVariants} className="text-center">
        <span className="text-sm text-gray-700 italic opacity-60">
          Today's Moral Value
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mt-2">
          "{dailyValue}"
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default DailyMoralValue;