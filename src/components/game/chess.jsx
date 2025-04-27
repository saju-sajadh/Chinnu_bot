"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Comic_Neue } from "next/font/google";
import Image from "next/image";
import Head from "next/head";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function ChessGame({ onClose }) {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("Your Turn (White)");
  const [fen, setFen] = useState(game.fen());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);

  const moveSound = typeof Audio !== "undefined" ? new Audio("/games/sounds/ting.mp3") : null;
  const winSound = typeof Audio !== "undefined" ? new Audio("/games/sounds/victory.mp3") : null;
  const drawSound = typeof Audio !== "undefined" ? new Audio("/games/sounds/gameover.mp3") : null;

  const evaluateBoard = (chess) => {
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let score = 0;
    const board = chess.board();
    for (let rank of board) {
      for (let piece of rank) {
        if (piece) {
          const value = pieceValues[piece.type];
          score += piece.color === "w" ? -value : value;
        }
      }
    }
    return score;
  };

  const makeAIMove = () => {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return;

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of moves) {
      const tempGame = new Chess(game.fen());
      tempGame.move(move);
      const score = evaluateBoard(tempGame);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    if (bestMove) {
      const newGame = new Chess(game.fen());
      newGame.move(bestMove);
      setGame(newGame);
      setFen(newGame.fen());
      if (moveSound) moveSound.play().catch((err) => console.error("Audio error:", err));

      if (newGame.isGameOver()) {
        setGameOver(true);
        if (newGame.isCheckmate()) {
          setStatus("Black Wins!");
          if (winSound) winSound.play().catch((err) => console.error("Audio error:", err));
        } else {
          setStatus("It's a Tie!");
          if (drawSound) drawSound.play().catch((err) => console.error("Audio error:", err));
        }
      } else {
        setStatus("Your Turn (White)");
      }
    }
  };

  const onSquareClick = (square) => {
    if (game.turn() !== "w" || gameOver) return;

    if (selectedSquare) {
      if (square === selectedSquare) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });

        if (move) {
          setFen(game.fen());
          if (moveSound) moveSound.play().catch((err) => console.error("Audio error:", err));

          if (game.isGameOver()) {
            setGameOver(true);
            if (game.isCheckmate()) {
              setStatus("You Win!");
              if (winSound) winSound.play().catch((err) => console.error("Audio error:", err));
            } else {
              setStatus("It's a Tie!");
              if (drawSound) drawSound.play().catch((err) => console.error("Audio error:", err));
            }
          } else {
            setStatus("Chinnu's Turn (Black)");
            setTimeout(makeAIMove, 500);
          }
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }
      } catch (e) {
        // Invalid move; allow reselection or deselection
      }
      setSelectedSquare(null);
      setLegalMoves([]);
    }

    const piece = game.get(square);
    if (piece && piece.color === "w") {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }).map((move) => move.to);
      setLegalMoves(moves);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setGameOver(false);
    setStatus("Your Turn (White)");
    setBoardOrientation("white");
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <>
      <Head>
        <title>Chinnu Chess</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center lg:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-3xl bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 rounded-3xl shadow-2xl p-6 sm:p-8 ${comicNeue.className}`}
        >
          {/* Decorative background elements */}
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
              Chess
            </h1>
          </div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-8"
          >
            {status}
          </motion.h2>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-full max-w-[400px]"
            >
              <Chessboard
                position={fen}
                onSquareClick={onSquareClick}
                boardOrientation={boardOrientation}
                customBoardStyle={{
                  borderRadius: "16px",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                }}
                customSquareStyles={{
                  ...Array(64)
                    .fill()
                    .reduce((acc, _, i) => {
                      const square = String.fromCharCode(97 + (i % 8)) + (8 - Math.floor(i / 8));
                      acc[square] = {
                        backgroundColor:
                          (i + Math.floor(i / 8)) % 2 === 0 ? "#fff3cc" : "#ffcc99",
                      };
                      return acc;
                    }, {}),
                  ...(selectedSquare
                    ? {
                        [selectedSquare]: {
                          backgroundColor: "rgba(0, 255, 0, 0.5)",
                          border: "3px solid #00cc00",
                        },
                      }
                    : {}),
                  ...legalMoves.reduce((acc, move) => {
                    acc[move] = {
                      backgroundColor: "rgba(255, 255, 0, 0.5)",
                      border: "3px dashed #ffcc00",
                    };
                    return acc;
                  }, {}),
                }}
              />
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={resetGame}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="py-2 lg:py-3 cursor-pointer px-4 lg:px-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-teal-600 transition-all"
              aria-label="Reset game"
            >
              Play Again
            </motion.button>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="py-2 lg:py-3 cursor-pointer px-4 lg:px-8 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-red-500 hover:to-orange-500 transition-all"
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