import React from "react";
import { Comic_Neue } from "next/font/google";
import { moralValues } from "@/libs/utils";

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

  return (
    <h1
      className={`text-lg sm:text-2xl font-medium text-gray-900 dark:text-white ${comicNeue.className} grid gap-2`}
    >
        <span className="text-sm text-black italic opacity-35">Daily Value Prompt</span>
      " {dailyValue} "
    </h1>
  );
};

export default DailyMoralValue;
