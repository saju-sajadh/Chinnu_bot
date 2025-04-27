"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Comic_Neue } from "next/font/google";
import { GoogleGenerativeAI } from "@google/generative-ai";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function QuizGame({ topic, grade, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key is missing");
    setError("Oops! Something went wrong. Please try again later.");
    setLoading(false);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const prompt = `
          Generate a quiz with exactly 5 multiple-choice questions for ${topic} at Grade ${grade} level. Each question must have exactly 3 answer options, with one correct answer. Return the response in the following JSON format:
          [
            {
              "question": "Question text",
              "options": ["Option 1", "Option 2", "Option 3"],
              "correctAnswer": "Option 1"
            },
            ...
          ]
        `;
        const result = await model.generateContent(prompt);
        const quizDataText = result.response.text();
        const cleanedText = quizDataText.replace(/```json\n|\n```/g, "").trim();
        const quizData = JSON.parse(cleanedText);
        if (!Array.isArray(quizData) || quizData.length !== 5) {
          throw new Error("Invalid quiz format");
        }
        setQuestions(quizData);
      } catch (err) {
        setError("Failed to load quiz questions. Please try again!");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topic, grade]);

  useEffect(() => {
    if (quizCompleted || loading || error) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleOptionSelect(null);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, quizCompleted, loading, error]);

  const handleOptionSelect = (option) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const currentQuestion = questions[currentQuestionIndex];
    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setTimer(10);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const renderStars = () => {
    return (
      <div className="flex justify-center gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 1 }}
            animate={{ scale: i < score ? 1.2 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`text-4xl ${i < score ? "text-yellow-300 drop-shadow-md" : "text-gray-300"}`}
          >
            ★
          </motion.span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-2xl bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 rounded-3xl shadow-2xl p-8 text-center ${comicNeue.className}`}
        >
          <div className="flex flex-col justify-center items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-t-blue-500 border-blue-200 rounded-full"
            />
            <span className="text-2xl font-bold text-blue-600">
              Getting Your Fun Quiz...
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-2xl from-yellow-300 via-pink-300 to-blue-300 rounded-3xl shadow-2xl p-8 text-center ${comicNeue.className}`}
        >
          <span className="text-xl font-bold text-red-600">{error}</span>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="mt-6 py-3 cursor-pointer px-8 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-red-500 hover:to-orange-500 transition-all"
            aria-label="Close quiz"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-2xl bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 rounded-3xl shadow-2xl p-8 text-center ${comicNeue.className}`}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-4xl font-bold text-purple-600 mb-4"
          >
            Yay! Quiz Done!
          </motion.h2>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl font-bold text-blue-600 mb-6 block"
          >
            Your Score: {score}/5
          </motion.span>
          {renderStars()}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="mt-8 cursor-pointer py-3 px-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-teal-600 transition-all"
            aria-label="Finish quiz"
          >
            Finish
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center lg:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full max-w-2xl bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 rounded-3xl shadow-2xl p-6 sm:p-8 ${comicNeue.className}`}
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-400 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-400 rounded-full opacity-20 translate-x-20 translate-y-20" />

        <h2 className="text-3xl sm:text-4xl font-bold text-center text-purple-600 mb-4">
          {topic} Quiz - Grade {grade}
        </h2>
        <div className="relative h-4 bg-pink-200 rounded-full overflow-hidden mb-4">
          <motion.div
            animate={{ width: `${(timer / 10) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-teal-500"
          />
        </div>
        <span className="text-lg font-bold text-blue-600 mb-4 block text-center">
          Time left: {timer} seconds
        </span>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          {currentQuestion.question}
        </p>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              whileHover={{ scale: selectedOption ? 1 : 1.05 }}
              whileTap={{ scale: selectedOption ? 1 : 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`w-full py-4 px-6 text-lg font-bold text-gray-800 rounded-2xl shadow-lg transition-all border-4 cursor-pointer
                ${
                  selectedOption
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-300 border-green-500 text-white"
                      : option === selectedOption
                      ? "bg-red-300 border-red-500 text-white"
                      : "bg-gray-200 border-gray-300 text-gray-500 opacity-50"
                    : "bg-gradient-to-r from-yellow-200 to-pink-200 border-yellow-400 hover:from-yellow-300 hover:to-pink-300"
                }`}
              aria-label={`Select option ${option}`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}