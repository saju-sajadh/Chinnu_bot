"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SoundOutlined, AudioOutlined } from "@ant-design/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { textToSpeech, stopSpeech } from "@/libs/textToSpeech"; 
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const systemInstructions = `
You are a creative storyteller for children, tasked with crafting an interactive storytelling experience that guides a child to create a moral-valued story. Your role is to generate engaging, age-appropriate questions that inspire creativity and build toward a cohesive story with a meaningful moral at the end. Each question should be simple, fun, and encourage imaginative answers suitable for children aged 10-15. The questions should logically connect to previous answers, ensuring the story feels seamless and personalized. When generating the final story, incorporate all user inputs vividly, using playful language, colorful descriptions, and a positive tone. The story must conclude with a clear, age-appropriate moral that reflects values like kindness, honesty, courage, or teamwork, derived naturally from the child's inputs. Provide only the question text when asked for a question, and ensure the final story is exciting, coherent, and ends with a moral.
`;
const chat = model.startChat({
  history: [
    { role: "user", parts: [{ text: "I am here for a story" }] },
    { role: "model", parts: [{ text: "ok lets do it!" }] },
  ],
});

const makeGeminiStory = async (prompt) => {
  try {
    if (!apiKey) {
      console.error("Gemini API key is missing");
      return;
    }

    const fullPrompt = `systemInstructions: ${systemInstructions}\n\nUser Prompt: ${prompt}`;
    const result = await chat.sendMessage(fullPrompt);
    const data = result.response.text();
    return data;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};

const StoryMaker = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [story, setStory] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setUserInput(transcript);
    }
  }, [transcript, listening]);

  useEffect(() => {
    const fetchInitialQuestion = async () => {
      setIsLoading(true);
      const initialPrompt =
        "Generate the first engaging, age-appropriate question to ask a child (aged 5-10) to begin creating their own moral-valued story. The question should spark creativity and set the stage for a fun, imaginative adventure.";
      const question = await makeGeminiStory(initialPrompt);
      setCurrentQuestion(question);
      setIsLoading(false);

      const utterance = await textToSpeech(question, {
        lang: "en-US",
        rate: 1,
        pitch: 1,
      });
      if (utterance) {
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
      }
    };
    fetchInitialQuestion();
  }, []);

  useEffect(() => {
    if (step > 0 && step < 5 && currentQuestion) {
      stopSpeech();
      const utterance = textToSpeech(currentQuestion, {
        lang: "en-US",
        rate: 1,
        pitch: 1,
      });
      if (utterance) {
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
      }
    }
  }, [currentQuestion, step]);

  // Handle user input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    stopSpeech();
    setIsSpeaking(false);
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    }

    const newAnswers = [...answers, userInput];
    setAnswers(newAnswers);

    if (step < 4) {
      // Fetch next question based on previous answers
      const questionPrompt = `
       Based on the following story inputs, generate the next engaging, age-appropriate question for a children's moral-valued story:
        ${newAnswers
          .map((answer, index) => `Answer ${index + 1}: ${answer}`)
          .join("\n")}
        The question should logically follow the previous answers, encourage creativity, and guide the story toward a cohesive narrative that will end with a meaningful moral.
      `;
      const nextQuestion = await makeGeminiStory(questionPrompt);
      setCurrentQuestion(nextQuestion);
      setStep(step + 1);
      setUserInput("");
      resetTranscript();
      setIsLoading(false);
    } else {
      // Generate final story
      const storyPrompt = `
        Using the following inputs, create a fun, cohesive children's story for a child aged 5-10: 
        ${newAnswers
          .map((answer, index) => `${index + 1}. ${answer}`)
          .join("\n")}
        Craft a vivid, exciting story with simple, playful language and colorful descriptions. Incorporate all user inputs seamlessly to make the story feel personal. Ensure the story concludes with a clear, age-appropriate moral (e.g., kindness, honesty, courage, teamwork) that naturally emerges from the inputs. End the story with a sentence explicitly stating the moral, such as "And so, [character] learned that [moral]."
      `;
      const generatedStory = await makeGeminiStory(storyPrompt);
      setStory(generatedStory);
      setStep(5);
      setUserInput("");
      resetTranscript();
      setIsLoading(false);
    }
  };

  // Toggle speech for the current question
  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const utterance = textToSpeech(currentQuestion, {
        lang: "en-US",
        rate: 1,
        pitch: 1,
      });
      if (utterance) {
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
      }
    }
  };

  // Toggle voice recording
  const toggleRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        "Speech recognition is not supported in your browser. Please try using Chrome."
      );
      return;
    }
    if (!isMicrophoneAvailable) {
      alert(
        "Microphone is not available. Please check your device settings or permissions."
      );
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
        interimResults: true,
      });
    }
  };

  // Animation variants
  const questionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const storyVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center lg:p-4 ">
      <div className="max-w-2xl w-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-3xl shadow-2xl p-2 lg:p-8">
        <AnimatePresence mode="wait">
          {step < 5 ? (
            <motion.div
              key={step}
              variants={questionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-purple-600 mb-6 font-comic-sans">
                Let’s Create a Magical Story!
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <p className="text-xl text-blue-500 font-comic-sans">
                  Question {step + 1}: {currentQuestion}
                </p>
                <motion.button
                  onClick={toggleSpeech}
                  className="py-2 px-2 cursor-pointer flex justify-center items-center rounded-full bg-yellow-200 hover:bg-yellow-300 transition-colors"
                  aria-label={
                    isSpeaking ? "Stop reading" : "Read question aloud"
                  }
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <SoundOutlined
                    className={`text-lg ${
                      isSpeaking ? "text-purple-600" : "text-gray-600"
                    }`}
                  />
                </motion.button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center w-full gap-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type or speak your answer..."
                    className="flex-1 p-3 rounded-full border-2 border-purple-300 focus:outline-none focus:border-purple-500 text-lg"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="button"
                    onClick={toggleRecording}
                    className={`py-2 px-3 cursor-pointer rounded-full ${
                      listening ? "bg-red-500" : "bg-blue-500"
                    } text-white hover:bg-opacity-80 transition-colors ${
                      !browserSupportsSpeechRecognition ||
                      !isMicrophoneAvailable
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      !browserSupportsSpeechRecognition ||
                      !isMicrophoneAvailable
                    }
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    animate={
                      listening
                        ? {
                            scale: [1, 1.1, 1],
                            transition: { repeat: Infinity, duration: 0.8 },
                          }
                        : {}
                    }
                    aria-label={
                      listening ? "Stop recording" : "Start recording"
                    }
                  >
                    <AudioOutlined className="text-lg" />
                  </motion.button>
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`px-6 py-3 rounded-full text-white font-bold text-lg ${
                    isLoading || !userInput.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {isLoading ? "Loading..." : "Next"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              variants={storyVariants}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-purple-600 mb-6 font-comic-sans">
                Your Magical Story!
              </h1>
              <div className="prose text-lg text-gray-800 bg-yellow-100 p-2 lg:p-6 rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto scroll-smooth custom-scrollbar">
                {story.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 font-comic-sans">
                    {paragraph}
                  </p>
                ))}
              </div>
              <motion.button
                onClick={() => {
                  setStep(0);
                  setAnswers([]);
                  setStory("");
                  setIsLoading(true);
                  stopSpeech();
                  setIsSpeaking(false);
                  const fetchInitialQuestion = async () => {
                    const initialPrompt =
                      "Generate the first question to ask a kid to create their own moral-valued story.";
                    const question = await makeGeminiStory(initialPrompt);
                    setCurrentQuestion(question);
                    setIsLoading(false);
                    const utterance = await textToSpeech(question, {
                      lang: "en-US",
                      rate: 1,
                      pitch: 1,
                    });
                    if (utterance) {
                      setIsSpeaking(true);
                      utterance.onend = () => setIsSpeaking(false);
                    }
                  };
                  fetchInitialQuestion();
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-6 cursor-pointer px-6 py-3 rounded-full bg-purple-600 text-white font-bold text-lg hover:bg-purple-700"
              >
                Start a New Story
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoryMaker;
