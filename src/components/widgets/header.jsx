"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sour_Gummy } from "next/font/google";

const sourGummy = Sour_Gummy({
  subsets: ["latin"],
  weights: [400, 500, 700],
  display: "swap",
});

function Header({ setShowProfileModal }) {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full z-20 flex justify-between items-center px-4 sm:px-8 bg-white ">
      <motion.div
        className="flex items-center gap-3 cursor-pointer py-1"
        whileHover="hover"
        whileTap="tap"
        initial={{ scale: 1 }}
      >
        <div className="p-1 border-2 border-white shadow-md bg-[#FEF7DE] rounded-full">
          <Image
            onClick={() => {
              router.push("/about");
            }}
            src="/logos/xai-logo.png"
            alt="xAI Logo"
            width={60}
            height={60}
            priority
          />
        </div>

        <div className="grid lg:flex jsutify-center items-center">
          <span className="text-3xl font-extrabold font-sans sm:text-4xl text-black drop-shadow-md">
            Siddha.AI
          </span>
          <span
            className={`lg:ml-2 lg:mt-4 text-base italic ${sourGummy.className}`}
          >
            {" "}
            Your AI Companion
          </span>
        </div>
      </motion.div>

      <motion.button
        className="absolute right-2 bottom-0 cursor-pointer bg-white transition-colors"
        onClick={() => setShowProfileModal(true)}
        aria-label="Open profile modal"
        whileHover="hover"
        whileTap="tap"
        initial={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          className="rounded"
          src={"/logos/chinmayananda-drawing.png"}
          alt="User Avatar"
          width={100}
          height={100}
        />
      </motion.button>
    </header>
  );
}

export default Header;
