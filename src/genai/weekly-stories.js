"use client";

import React from "react";
import { motion } from "framer-motion";
import { Comic_Neue } from "next/font/google";
import Image from "next/image";
import Head from "next/head";
import { moralStories } from "@/libs/utils";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function WeeklyMoralStory() {
  const getWeeklyIndex = () => {
    const startDate = new Date("2025-01-01T06:00:00");
    const now = new Date();
    const diffInMs = now - startDate;
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    return diffInWeeks % moralStories.length;
  };

  const weeklyStory = moralStories[getWeeklyIndex()];

  return (
    <>
      <Head>
        <title>Chinnu Weekly Story</title>
      </Head>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full mx-auto bg-gradient-to-br from-yellow-100 to-pink-100 rounded-3xl shadow-2xl p-6 ${comicNeue.className}`}
      >
        <div className="relative overflow-hidden max-h-[80vh] overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-400 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-400 rounded-full opacity-20 translate-x-20 translate-y-20" />

          <div className="flex flex-col gap-6">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-lg sm:text-xl text-purple-600 italic text-center"
            >
              Your Weekly Fun Story!
            </motion.span>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-blue-600 text-center drop-shadow-md"
            >
              {weeklyStory.title}
            </motion.h2>
            {weeklyStory.content.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                <p className="text-lg sm:text-xl text-gray-800 break-words leading-relaxed">
                  {segment}
                </p>
                {weeklyStory.images[index] && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="mx-auto"
                  >
                    <Image
                      src={weeklyStory.images[index].url}
                      alt={
                        weeklyStory.images[index].alt ||
                        `Illustration for ${weeklyStory.title}`
                      }
                      width={200}
                      height={200}
                      className="w-full max-w-[150px] sm:max-w-[200px] h-auto rounded-2xl shadow-lg"
                      loading="lazy"
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + weeklyStory.content.length * 0.1, duration: 0.4 }}
              className="flex flex-col gap-2 mt-6 bg-blue-200 rounded-2xl p-4 shadow-md"
            >
              <p className="text-center text-lg sm:text-xl font-bold text-blue-600">
                Moral of the Story
              </p>
              <p className="text-center text-lg sm:text-xl font-bold text-purple-600">
                {weeklyStory.moral}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}