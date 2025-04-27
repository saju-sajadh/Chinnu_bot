import { motion } from "framer-motion";
import Head from "next/head";

const moralTopics = [
  "Honesty",
  "Kindness",
  "Courage",
  "Respect",
  "Responsibility",
  "Forgiveness",
  "Gratitude",
  "Perseverance",
];

const ThoughtsTopic = ({ onSelectTopic }) => {
  const handleTopicClick = (topic) => {
    if (onSelectTopic) {
      onSelectTopic(topic);
    }
  };

  return (
    <>
      <Head>
        <title>PlaySchool Moral Topics</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="from-yellow-200 via-pink-200 to-blue-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl p-6 bg-white rounded-3xl shadow-2xl relative overflow-hidden"
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-red-300 rounded-full opacity-30 -translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-30 translate-x-16 translate-y-16" />
          
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-purple-600 drop-shadow-md">
            Pick a Fun Topic!
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {moralTopics.map((topic) => (
              <motion.button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="px-4 cursor-pointer py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl shadow-lg hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ThoughtsTopic;