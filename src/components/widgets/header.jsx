"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

function Header({ userData, setShowProfileModal }) {
  const router = useRouter();

  const buttonVariants = {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.95 },
  };

  return (
    <header
      className="fixed top-0 w-full z-10 flex justify-between items-center px-4 sm:px-8 py-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 shadow-lg"
      style={{ fontFamily: "'Comic Neue', cursive" }}
    >
      <motion.div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push("/")}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          src="/logos/xai-logo.png"
          alt="xAI Logo"
          width={50}
          height={50}
          className="rounded-full border-4 border-white shadow-md"
          priority
        />
        <span className="text-3xl sm:text-4xl font-bold text-purple-600 drop-shadow-md">
          Chinnu
        </span>
      </motion.div>

      <motion.button
        className="p-1 cursor-pointer rounded-full bg-white border-4 border-green-400 shadow-lg hover:bg-green-100 transition-colors"
        onClick={() => setShowProfileModal(true)}
        aria-label="Open profile modal"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          className="rounded-full"
          src={userData?.avatar || "/avatar1.png"}
          alt="User Avatar"
          width={48}
          height={48}
        />
      </motion.button>
    </header>
  );
}

export default Header;