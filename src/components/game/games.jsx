"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";

const games = [
  { name: "Tic-Tac-Toe", id: "TicTacToe", icon: "/games/images/tic-tac-toe.png" },
  { name: "Chess", id: "Chess", icon: "/games/images/chess.png" },
];

export default function Games({ onClose, onStartGame }) {
  const handleSelectGame = (gameId) => {
    onStartGame(gameId);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Head>
        <title>Chinnu Fun Games</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="from-yellow-300 via-pink-300 to-blue-300 flex items-center justify-center lg:p-6 max-h-[90vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden sm:overflow-y-auto lg:overflow-y-hidden sm:scroll-smooth"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-400 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-400 rounded-full opacity-20 translate-x-20 translate-y-20" />

          <div className="flex justify-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold flex items-center text-purple-600 drop-shadow-lg">
              <Image
                src="/logos/xai-logo.png"
                alt="Chinnu Logo"
                width={60}
                height={60}
                priority
                className="mr-3 rounded-full shadow-md"
              />
              Chinnu
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600 drop-shadow-md">
            Pick a Super Fun Game!
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => (
              <motion.button
                key={game.id}
                onClick={() => handleSelectGame(game.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex flex-col cursor-pointer justify-center items-center p-4 bg-gradient-to-r from-pink-200 to-yellow-200 rounded-2xl shadow-lg hover:from-pink-300 hover:to-yellow-300 transition-all border-4 border-pink-400"
                aria-label={`Select ${game.name}`}
              >
                <Image
                  src={game.icon}
                  alt={`${game.name} Icon`}
                  width={64}
                  height={64}
                  className="mb-3 rounded-lg shadow-sm"
                  loading="lazy"
                />
                <span className="text-xl font-bold text-gray-800">
                  {game.name}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <motion.button
              onClick={handleCancel}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="py-4 px-8 cursor-pointer bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl font-bold text-xl shadow-lg hover:from-red-500 hover:to-orange-500 transition-all duration-300"
              aria-label="Cancel game selection"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}