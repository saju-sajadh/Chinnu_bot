"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Comic_Neue } from "next/font/google";
import Image from "next/image";
import Head from "next/head";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacToe({ onClose }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Audio objects
  const moveSound = typeof Audio !== "undefined" ? new Audio("/games/sounds/ting.mp3") : null;
  const winSound = typeof Audio !== "undefined" ? new Audio("/games/sounds/victory.mp3") : null;
  const drawSound = typeof Audio !== "undefined" ? new Audio("/games/sounds/gameover.mp3") : null;
  const bgMusic = typeof Audio !== "undefined" ? new Audio("/games/sounds/music.mp3") : null;

  // Play background music on mount, clean up on unmount or close
  useEffect(() => {
    if (bgMusic) {
      bgMusic.loop = true;
      bgMusic.volume = 0.5;
      bgMusic.play().catch(err => console.error("Background music autoplay error:", err));
    }

    return () => {
      if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }
    };
  }, [bgMusic]);

  // Check for winner or draw
  const checkWinner = (currentBoard) => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return currentBoard.every(cell => cell !== null) ? "Draw" : null;
  };

  // Minimax algorithm for AI
  const minimax = (newBoard, depth, isMaximizing) => {
    const result = checkWinner(newBoard);
    if (result === "X") return -10 + depth;
    if (result === "O") return 10 - depth;
    if (result === "Draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = "O";
          const score = minimax(newBoard, depth + 1, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!newBoard[i]) {
          newBoard[i] = "X";
          const score = minimax(newBoard, depth + 1, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Computer's move
  const computerMove = () => {
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    if (bestMove !== null) {
      const newBoard = [...board];
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      if (moveSound) moveSound.play().catch(err => console.error("Audio error:", err));
      const result = checkWinner(newBoard);
      if (result) {
        setWinner(result);
        setGameOver(true);
        if (result === "O") {
          if (winSound) winSound.play().catch(err => console.error("Audio error:", err));
        } else if (result === "Draw") {
          if (drawSound) drawSound.play().catch(err => console.error("Audio error:", err));
        }
      }
      setIsPlayerTurn(true);
    }
  };

  // Handle player's move
  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    if (moveSound) moveSound.play().catch(err => console.error("Audio error:", err));
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      setGameOver(true);
      if (result === "X") {
        if (winSound) winSound.play().catch(err => console.error("Audio error:", err));
      } else if (result === "Draw") {
        if (drawSound) drawSound.play().catch(err => console.error("Audio error:", err));
      }
    } else {
      setIsPlayerTurn(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameOver(false);
  };

  // Computer move effect
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(computerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver]);

  return (
    <>
      <Head>
        <title>Chinnu Tic-Tac-Toe</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center lg:p-6 p-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-2xl bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 rounded-3xl shadow-2xl p-2 lg:p-6 ${comicNeue.className} `}
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
              Tic-Tac-Toe
            </h1>
          </div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-8"
          >
            {winner
              ? winner === "Draw"
                ? "It's a Tie!"
                : `${winner === "X" ? "You" : "Chinnu"} Wins!`
              : isPlayerTurn
              ? "Your Turn (X)"
              : "Chinnu's Turn (O)"}
          </motion.h2>

          <div className="grid grid-cols-3 gap-4 w-80 mx-auto">
            {board.map((cell, index) => (
              <motion.button
                key={index}
                onClick={() => handleClick(index)}
                whileHover={{ scale: gameOver || cell ? 1 : 1.1 }}
                whileTap={{ scale: gameOver || cell ? 1 : 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`h-24 sm:h-28 text-5xl font-bold flex items-center justify-center rounded-2xl shadow-lg border-4 transition-all
                  ${
                    cell === "X"
                      ? "bg-blue-400 border-blue-500 text-white"
                      : cell === "O"
                      ? "bg-red-400 border-red-500 text-white"
                      : "bg-gradient-to-r from-yellow-200 to-pink-200 border-yellow-400 hover:from-yellow-300 hover:to-pink-300"
                  }
                  ${gameOver || cell ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={gameOver || cell}
                aria-label={`Cell ${index + 1}`}
              >
                {cell}
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={resetGame}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="py-3 cursor-pointer px-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-teal-600 transition-all"
              aria-label="Reset game"
            >
              Play Again
            </motion.button>
            <motion.button
              onClick={() => {
                if (bgMusic) bgMusic.pause();
                onClose();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="py-3 cursor-pointer px-8 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-red-500 hover:to-orange-500 transition-all"
              aria-label="Close game"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}