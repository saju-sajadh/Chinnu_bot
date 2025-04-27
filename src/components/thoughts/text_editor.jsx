"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Comic_Neue } from "next/font/google";
import Head from "next/head";
import MenuBar from "./editor_menu";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { fetchGeminiResponse } from "@/genai/prompt";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RichTextEditor({ selectedTopic }) {
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isCharLimitExceeded, setIsCharLimitExceeded] = useState(false);
  const editorRef = useRef(null);
  const MAX_CHARS = 1000;

  useEffect(() => {
    const fetchInitialQuestion = async () => {
      if (selectedTopic) {
        setIsLoading(true);
        const prompt = `Generate a thought-provoking question about ${selectedTopic} aligned with the Chinmaya Vision Program's holistic education principles.`;
        const question = await fetchGeminiResponse(prompt);
        const initialContent = `<h3>${question}</h3><p>Your answer...</p>`;
        setContent(initialContent);
        setConversation([{ role: "model", text: question }]);
        setCharCount(question.length);
        setIsLoading(false);
      } else {
        setContent("<p>Write your thoughts...</p>");
        setConversation([]);
        setCharCount(0);
      }
    };
    fetchInitialQuestion();
  }, [selectedTopic]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4 text-base sm:text-lg text-gray-800",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4 text-base sm:text-lg text-gray-800",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "text-xl sm:text-2xl font-bold text-purple-600",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "text-base sm:text-lg text-gray-800",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "max-h-[60vh] sm:max-h-[50vh] min-h-[200px] sm:min-h-[300px] bg-gradient-to-br from-yellow-100 to-pink-100 rounded-2xl p-3 sm:p-4 focus:outline-none text-base sm:text-lg leading-relaxed custom-scrollbar",
      },
    },
    editable: !isCharLimitExceeded,
    onUpdate: ({ editor }) => {
      const newText = editor.getText();
      const newCharCount = newText.length;
      if (newCharCount > MAX_CHARS) {
        const truncatedText = newText.slice(0, MAX_CHARS);
        editor.commands.setContent(truncatedText, false);
        setContent(truncatedText);
        setCharCount(MAX_CHARS);
        setIsCharLimitExceeded(true);
        setIsTyping(false);
      } else {
        setContent(editor.getHTML());
        setCharCount(newCharCount);
        setIsTyping(newText !== conversation[conversation.length - 1]?.text);
        setIsCharLimitExceeded(false);
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleAsk = async () => {
    if (!editor || isLoading || charCount >= MAX_CHARS || isCharLimitExceeded) return;
    setIsLoading(true);

    const userAnswer = editor.getText().split("\n").slice(1).join("\n").trim();
    if (!userAnswer) {
      setIsLoading(false);
      return;
    }

    const prompt = `User's answer on ${selectedTopic}: "${userAnswer}". Respond with a follow-up question or feedback aligned with the Chinmaya Vision Program's principles.`;
    const geminiResponse = await fetchGeminiResponse(prompt);

    const newConversation = [
      ...conversation,
      { role: "user", text: userAnswer },
      { role: "model", text: geminiResponse },
    ];
    setConversation(newConversation);

    const updatedContent = newConversation
      .map((entry) =>
        entry.role === "user"
          ? `<p><strong>You:</strong> ${entry.text}</p>`
          : `<p><strong>Chinnu:</strong> ${entry.text}</p>`
      )
      .join("");
    const updatedCharCount = newConversation
      .map((entry) => entry.text)
      .join("")
      .length;
    if (updatedCharCount <= MAX_CHARS) {
      setContent(updatedContent);
      setCharCount(updatedCharCount);
    } else {
      setContent("<p>Too many words! Let's keep it short.</p>");
      setCharCount(0);
      setConversation([]);
      setIsCharLimitExceeded(true);
    }
    setIsTyping(false);
    setIsLoading(false);
  };

  const handleEndConversation = async () => {
    if (!conversation.length || isLoading) return;
    setIsLoading(true);
    setIsAnimating(true);

    const userAnswers = conversation
      .filter((entry) => entry.role === "user")
      .map((entry) => entry.text)
      .join("\n");
    const prompt = `Based on the user's answers on ${selectedTopic}: "${userAnswers}", create a beautiful, concise thought that corrects any misconceptions, appreciates good answers, and aligns with the Chinmaya Vision Program's holistic education principles.`;
    const finalThought = await fetchGeminiResponse(prompt);

    setTimeout(() => {
      const finalContent = `<h2>Final Thought on ${selectedTopic}</h2><p>${finalThought}</p>`;
      setContent(finalContent);
      setCharCount(finalThought.length);
      setConversation([]);
      setIsAnimating(false);
      setIsLoading(false);
      setIsCharLimitExceeded(false);
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Chinnu Writing Adventure</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center lg:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-[90vw] sm:max-w-4xl bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 rounded-3xl shadow-2xl p-4 sm:p-6 ${comicNeue.className} custom-scrollbar max-h-[calc(100vh-2rem)] overflow-y-auto scroll-smooth relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-red-400 rounded-full opacity-20 -translate-x-12 sm:-translate-x-16 -translate-y-12 sm:-translate-y-16" />
          <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-green-400 rounded-full opacity-20 translate-x-16 sm:translate-x-20 translate-y-16 sm:translate-y-20" />

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-purple-600 mb-4 sm:mb-6 drop-shadow-lg"
          >
            Write about {selectedTopic || "Your Thoughts"}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 0 : 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-4 border-yellow-400 rounded-2xl bg-white shadow-lg relative"
          >
            <MenuBar editor={editor} />
            <div ref={editorRef} className="relative">
              <EditorContent editor={editor} />
              {isTyping && !isCharLimitExceeded && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  onClick={isLoading ? null : handleAsk}
                  className={`absolute bottom-3 sm:bottom-4 right-3 sm:right-4 py-2 px-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full font-bold text-sm sm:text-lg shadow-md hover:from-blue-600 hover:to-teal-600 transition-all ${
                    isLoading || charCount >= MAX_CHARS
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={isLoading || charCount >= MAX_CHARS}
                  aria-label="Send answer"
                >
                  {isLoading ? "Thinking..." : "Send"}
                </motion.button>
              )}
            </div>
            <div className="flex justify-between items-center mt-2 px-3 sm:px-4">
              <p
                className={`text-xs sm:text-sm font-bold ${
                  charCount >= MAX_CHARS ? "text-red-500" : "text-purple-600"
                }`}
              >
                {charCount}/{MAX_CHARS} letters
              </p>
              {isCharLimitExceeded && (
                <p className="text-xs sm:text-sm text-red-500 font-bold">
                  Too many letters! Please end the conversation.
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex justify-end gap-3 sm:gap-4 mt-4 sm:mt-6"
          >
            <motion.button
              onClick={handleEndConversation}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`py-2 sm:py-3 px-6 sm:px-8 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl font-bold text-sm sm:text-lg shadow-lg hover:from-green-600 hover:to-teal-600 transition-all ${
                isLoading || !conversation.length
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={isLoading || !conversation.length}
              aria-label="End conversation"
            >
              {isLoading ? "Ending..." : "Finish Writing"}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}