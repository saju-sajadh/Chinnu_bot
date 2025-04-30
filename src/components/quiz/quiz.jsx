"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";

const topics = ["Honesty", "Teamwork", "Resilience", "Physical Fitness"];
const grades = Array.from({ length: 12 }, (_, i) => i + 1).slice(4, 8);

export default function Quiz({ onClose, onStartQuiz }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedTopic) {
      setError("Please pick a fun topic!");
      return;
    }
    if (!selectedGrade) {
      setError("Please choose a grade!");
      return;
    }
    setError("");
    setLoading(true);
    onStartQuiz(selectedTopic, selectedGrade);
    setLoading(false);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <Head>
        <title>Siddha Fun Quiz</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="from-yellow-300 via-pink-300 to-blue-300 flex items-center justify-center lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-400 rounded-full opacity-20 -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-400 rounded-full opacity-20 translate-x-20 translate-y-20" />

          <div className="flex justify-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold flex items-center text-purple-600 drop-shadow-lg">
              <Image
                src="/logos/xai-logo.png"
                alt="Siddha Logo"
                width={60}
                height={60}
                priority
                className="mr-3 rounded-full shadow-md"
              />
              Siddha
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600 drop-shadow-md">
            Start a Super Fun Quiz!
          </h2>

          <div className="space-y-8">
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                Pick a Topic
              </label>
              <select
                value={selectedTopic || ""}
                onChange={(e) => setSelectedTopic(e.target.value || null)}
                className="w-full p-4 text-lg bg-gradient-to-r from-pink-200 to-yellow-200 rounded-2xl border-4 border-pink-400 focus:outline-none focus:border-pink-500 text-gray-800 cursor-pointer"
                aria-label="Select quiz topic"
              >
                <option value="" disabled>
                  Choose a topic
                </option>
                {topics.map((topic) => (
                  <option key={topic} value={topic} className="text-gray-800">
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-3">
                Pick a Grade
              </label>
              <select
                value={selectedGrade || ""}
                onChange={(e) => setSelectedGrade(Number(e.target.value) || null)}
                className="w-full p-4 text-lg bg-gradient-to-r from-blue-200 to-green-200 rounded-2xl border-4 border-blue-400 focus:outline-none focus:border-blue-500 text-gray-800 cursor-pointer"
                aria-label="Select grade level"
              >
                <option value="" disabled>
                  Choose a grade
                </option>
                {grades.map((grade) => (
                  <option key={grade} value={grade} className="text-gray-800">
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-lg mt-6 text-center font-bold bg-red-100 rounded-2xl py-3 px-4 shadow-sm"
            >
              {error}
            </motion.p>
          )}

          <div className="flex gap-4 mt-10">
            <motion.button
              onClick={handleContinue}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex-1 py-4 cursor-pointer bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50"
              aria-label="Continue to start quiz"
            >
              Let’s Go!
            </motion.button>
            <motion.button
              onClick={handleCancel}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex-1 py-4 cursor-pointer bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-2xl font-bold text-xl shadow-lg hover:from-red-500 hover:to-orange-500 transition-all duration-300 disabled:opacity-50"
              aria-label="Cancel quiz setup"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}