"use client";

import { getDoc, _firestore, doc } from "@/libs/firebase";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { SendOutlined, SoundOutlined, AudioOutlined } from "@ant-design/icons";
import { fetchGeminiResponse } from "@/genai/prompt";
import { textToSpeech, stopSpeech } from "@/libs/textToSpeech";
import ModelWidgets from "@/components/widgets/model_widgets";
import Header from "@/components/widgets/header";
import ButtonWidget from "@/components/widgets/button_widget";
import DailyMoralValue from "@/genai/daily-prompt";
import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";
import { MobileMenu } from "@/components/widgets/mobile-menu";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { mic_off, mic_on } from "@/libs/utils";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuizGameModal, setShowQuizGameModal] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showTicTacToeModal, setShowTicTacToeModal] = useState(false);
  const [showChessModal, setShowChessModal] = useState(false);
  const [showMoralStoriesModal, setShowMoralStoriesModal] = useState(false);
  const [showThoughtsModal, setShowThoughtsModal] = useState(false);
  const [showThoughtsTopicModal, setShowThoughtsTopicModal] = useState(false);
  const [showStoryMaker, setShowStoryMaker] = useState(false);
  const [quizParams, setQuizParams] = useState({ topic: null, grade: null });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const hasSentWelcomeMessage = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    onError: (event) => {
      SpeechRecognition.stopListening();
    },
    onEnd: () => {},
  });

  useEffect(() => {
    if (listening) {
      setInput(transcript);
    }
  }, [transcript, listening]);

  const fetchData = async () => {
    try {
      if (!isLoaded || !user || !_firestore) {
        return;
      }
      const userDocRef = doc(_firestore, "users", user.id);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        return;
      }
      setUserData(userDoc.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (userData && !hasSentWelcomeMessage.current) {
      const sendWelcomeMessage = async () => {
        setIsLoading(true);
        const fullName =
          userData.firstName || "friend";
        const userName = fullName;
        const welcomePrompt = `Greet ${userName} in a friendly, concise way telling about cvp.`;
        try {
          const response = await fetchGeminiResponse(welcomePrompt);
          const botMessage = { text: response, sender: "bot" };
          setMessages([botMessage]);
          setIsLoading(false);
          const utterance = await textToSpeech(response, {
            lang: "en-US",
            rate: 1,
            pitch: 1,
          });
          if (utterance) {
            setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
          }
        } catch (error) {
          console.error("Error sending welcome message:", error);
          setIsLoading(false);
        }
        hasSentWelcomeMessage.current = true;
      };
      sendWelcomeMessage();
    }
  }, [userData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowProfileModal(false);
        setShowQuizModal(false);
        setShowQuizGameModal(false);
        setShowGamesModal(false);
        setShowTicTacToeModal(false);
        setShowChessModal(false);
        setShowMoralStoriesModal(false);
        setShowThoughtsModal(false);
        setShowThoughtsTopicModal(false);
        setShowStoryMaker(false);
        setIsDrawerOpen(false);
        stopSpeech();
        if (listening) {
          SpeechRecognition.stopListening();
          resetTranscript();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [listening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartQuiz = (topic, grade) => {
    setQuizParams({ topic, grade });
    setShowQuizModal(false);
    setShowQuizGameModal(true);
  };

  const handleStartGame = (game) => {
    setShowGamesModal(false);
    if (game === "TicTacToe") {
      setShowTicTacToeModal(true);
    }
    if (game === "Chess") {
      setShowChessModal(true);
    }
  };

  const handleWriteThought = (topic) => {
    setSelectedTopic(topic);
    setShowThoughtsTopicModal(false);
    setShowThoughtsModal(true);
  };

  const handleSendMessage = async () => {
    if (listening) {
      if (mic_off)
        mic_off.play().catch((err) => console.error("Audio error:", err));
      SpeechRecognition.stopListening();
      resetTranscript();
    }
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    resetTranscript();
    setIsLoading(true);
    const response = await fetchGeminiResponse(input);
    const botMessage = { text: response, sender: "bot" };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
    const utterance = await textToSpeech(response, {
      lang: "en-US",
      rate: 1,
      pitch: 1,
    });
    if (utterance) {
      console.log('utternece found')
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeech = (text) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      textToSpeech(text, { lang: "en-US", rate: 1, pitch: 1 });
      setIsSpeaking(true);
    }
  };

  const toggleRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Mic is not supported in your browser, try chrome!");
      return;
    }
    if (!isMicrophoneAvailable) {
      alert(
        "Microphone is not available. Please check your device settings or permissions."
      );
      return;
    }

    if (listening) {
      if (mic_off)
        mic_off.play().catch((err) => console.error("Audio error:", err));
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      if (mic_on)
        mic_on.play().catch((err) => console.error("Audio error:", err));
      try {
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
          interimResults: true,
        });
      } catch (error) {
        if (mic_off)
          mic_off.play().catch((err) => console.error("Audio error:", err));
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const menuItems = [
    {
      label: "Quiz",
      icon: "/logos/quiz.png",
      action: () => setShowQuizModal(true),
    },
    {
      label: "Games",
      icon: "/logos/games.png",
      action: () => setShowGamesModal(true),
    },
    {
      label: "Stories",
      icon: "/logos/stories.png",
      action: () => setShowMoralStoriesModal(true),
    },
    {
      label: "Thoughts",
      icon: "/logos/thoughts.png",
      action: () => setShowThoughtsModal(true),
    },
  ];

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  if (!userData || !isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300">
        <DailyMoralValue />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chinnu</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="relative min-h-screen flex flex-col bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200"
        style={{ fontFamily: "'Comic Neue', cursive" }}
      >
        <Image
          src={"/logos/cvp3.png"}
          alt=""
          width={300}
          height={300}
          quality={100}
          className="fixed top-60 lg:top-[350px] right-1/12 lg:right-[850px] z-0 opacity-50"
        />
        <Header setShowProfileModal={setShowProfileModal} />
        <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto py-4 mt-24 mb-40 lg:mb-24 z-10">
          <div className="flex-1 overflow-y-auto pb-32 sm:pb-48">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
                variants={messageVariants}
                initial="initial"
                animate="animate"
              >
                <div
                  className={`lg:max-w-[75%] m-4 lg:m-0 rounded-3xl p-4 text-lg flex items-center gap-3 shadow-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-200 text-gray-800"
                  }`}
                >
                  {message.sender === "bot" && (
                    <Image
                      src="/logos/xai-logo.png"
                      alt="Bot Avatar"
                      width={32}
                      height={32}
                      quality={100}
                      className="rounded-full bg-[#FEF7DE]"
                    />
                  )}
                  <span>{message.text}</span>
                  {message.sender === "bot" && (
                    <motion.button
                      onClick={() => toggleSpeech(message.text)}
                      className="py-1 px-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                      aria-label={isSpeaking ? "Stop speech" : "Read aloud"}
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
                  )}
                  {message.sender === "user" && (
                    <Image
                      src={`${userData?.avatar}` || "/avatars/avatar1.png"}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      quality={100}
                      className="rounded-full"
                    />
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                className="flex justify-start mb-4"
                variants={messageVariants}
                initial="initial"
                animate="animate"
              >
                <div className="bg-yellow-200 rounded-3xl p-4 shadow-lg flex items-center gap-3">
                  <Image
                    src="/logos/xai-logo.png"
                    alt="Bot Avatar"
                    width={32}
                    height={32}
                    quality={100}
                    className="rounded-full"
                  />
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-lg text-gray-800"
                  >
                    Thinking...
                  </motion.span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm rounded-t-3xl shadow-2xl p-6 z-10 max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute lg:hidden -top-6 left-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              >
                <MobileMenu menuItems={menuItems} />
              </motion.div>
            </div>
            <div className="flex px-3 items-center gap-3 bg-gradient-to-r from-pink-200 to-yellow-200 rounded-2xl p-4 border-4 border-pink-400">
              <motion.button
                className={`p-2 flex justify-center items-center cursor-pointer rounded-full ${
                  listening ? "bg-red-500" : "bg-blue-500"
                } text-white hover:bg-opacity-80 transition-colors ${
                  !browserSupportsSpeechRecognition || !isMicrophoneAvailable
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={toggleRecording}
                disabled={
                  !browserSupportsSpeechRecognition || !isMicrophoneAvailable
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
                aria-label={listening ? "Stop recording" : "Start recording"}
              >
                <AudioOutlined className="!text-xl" />
              </motion.button>
              <input
                type="text"
                placeholder="Ask me anything..."
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Type your message"
              />
              <motion.button
                className="p-2 flex justify-center items-center cursor-pointer rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Send message"
              >
                <SendOutlined className="!text-xl" />
              </motion.button>
            </div>
            <div
              className={`hidden lg:flex flex-col items-center w-full ${
                messages.length === 0 ? "mt-6" : "mt-4"
              }`}
            >
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ButtonWidget
                    functionality={setShowQuizModal}
                    label="Start quiz"
                    src="/logos/quiz.png"
                    text="Quiz"
                    className="bg-blue-400 hover:bg-blue-500 text-white rounded-2xl shadow-lg p-4 flex flex-col items-center gap-2 transition-colors"
                  />
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ButtonWidget
                    functionality={setShowMoralStoriesModal}
                    label="View moral stories"
                    src="/logos/stories.png"
                    text="Moral Stories"
                    className="bg-purple-400 hover:bg-purple-500 text-white rounded-2xl shadow-lg p-4 flex flex-col items-center gap-2 transition-colors"
                  />
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ButtonWidget
                    functionality={setShowGamesModal}
                    label="Play games"
                    src="/logos/games.png"
                    text="Games"
                    className="bg-green-400 hover:bg-green-500 text-white rounded-2xl shadow-lg p-4 flex flex-col items-center gap-2 transition-colors"
                  />
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ButtonWidget
                    functionality={() => setShowThoughtsTopicModal(true)}
                    label="Explore thoughts"
                    src="/logos/thoughts.png"
                    text="Thoughts"
                    className="bg-orange-400 hover:bg-orange-500 text-white rounded-2xl shadow-lg p-4 flex flex-col items-center gap-2 transition-colors"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
        <ModelWidgets
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
          userData={userData}
          showQuizModal={showQuizModal}
          setShowQuizModal={setShowQuizModal}
          showMoralStoriesModal={showMoralStoriesModal}
          setShowMoralStoriesModal={setShowMoralStoriesModal}
          showQuizGameModal={showQuizGameModal}
          setShowQuizGameModal={setShowQuizGameModal}
          quizParams={quizParams}
          showGamesModal={showGamesModal}
          setShowGamesModal={setShowGamesModal}
          showTicTacToeModal={showTicTacToeModal}
          setShowTicTacToeModal={setShowTicTacToeModal}
          showChessModal={showChessModal}
          setShowChessModal={setShowChessModal}
          showThoughtsModal={showThoughtsModal}
          setShowThoughtsModal={setShowThoughtsModal}
          handleStartQuiz={handleStartQuiz}
          handleStartGame={handleStartGame}
          showStoryMaker={showStoryMaker}
          setShowStoryMaker={setShowStoryMaker}
          showThoughtsTopicModal={showThoughtsTopicModal}
          setShowThoughtsTopicModal={setShowThoughtsTopicModal}
          handleWriteThought={handleWriteThought}
          selectedTopic={selectedTopic}
        />
      </div>
    </>
  );
}
