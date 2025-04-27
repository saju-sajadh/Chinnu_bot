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
      className="fixed top-0 w-full z-10 flex justify-between items-center px-4 sm:px-8 bg-white "
      
    >
      <motion.div
        className="flex items-center gap-3 cursor-pointer py-2"
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
          className="rounded-full border-4 border-white shadow-md bg-[#FEF7DE]"
          priority
        />
        <span className="text-3xl font-extrabold font-sans sm:text-4xl text-black drop-shadow-md">
          Chinnu
        </span>
      </motion.div>

      <motion.button
        className="absolute right-2 bottom-0 cursor-pointer bg-white  hover:bg-green-100 transition-colors"
        onClick={() => setShowProfileModal(true)}
        aria-label="Open profile modal"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          className="rounded"
          src={'/logos/chinmayananda-drawing.png'}
          alt="User Avatar"
          width={96}
          height={96}
        />
      </motion.button>
    </header>
  );
}

export default Header;