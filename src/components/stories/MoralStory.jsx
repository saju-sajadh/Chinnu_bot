import React, { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import WeeklyMoralStory from "@/genai/weekly-stories";

const MoralStories = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`lg:p-4 rounded-xl`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingOutlined className="!text-blue-400 text-2xl" />
          <span className="ml-2 text-gray-900 dark:text-white">
            Loading Weekly Story...
          </span>
        </div>
      ) : (
        <WeeklyMoralStory />
      )}
    </div>
  );
};

export default MoralStories;
