import React from "react";
import { Modal } from "../dialogue/dialogue_model";
import Profile from "../profile/profile";
import Quiz from "../quiz/quiz";
import QuizGame from "../quiz/quiz_game";
import Games from "../game/games";
import TicTacToe from "../game/tic_tac_toe";
import ChessGame from "../game/chess";
import MoralStories from "../stories/MoralStory";
import RichTextEditor from "../thoughts/text_editor";
import ThoughtsTopic from "../thoughts/thoughts_topic";
import StoryMaker from "../stories/storyMaker";

function ModelWidgets(props) {
  return (
    <div className="w-full">
      <Modal
        isOpen={props.showProfileModal}
        onClose={() => props.setShowProfileModal(false)}
        maxWidth="w-full"
      >
        <Profile
          isProfile={false}
          fName={props.userData?.firstName}
          lName={props.userData?.lastName}
          onClose={() => props.setShowProfileModal(false)}
        />
      </Modal>

      <Modal
        isOpen={props.showQuizModal}
        onClose={() => props.setShowQuizModal(false)}
        maxWidth="w-full"
      >
        <Quiz
          onClose={() => props.setShowQuizModal(false)}
          onStartQuiz={props.handleStartQuiz}
        />
      </Modal>

      <Modal
        isOpen={props.showQuizGameModal}
        onClose={() => props.setShowQuizGameModal(false)}
        maxWidth="w-full"
        maxHeight="max-h-[90vh]"
      >
        <QuizGame
          topic={props.quizParams.topic}
          grade={props.quizParams.grade}
          onClose={() => props.setShowQuizGameModal(false)}
        />
      </Modal>

      <Modal
        isOpen={props.showGamesModal}
        onClose={() => props.setShowGamesModal(false)}
        maxWidth="w-full"
      >
        <Games
          onClose={() => props.setShowGamesModal(false)}
          onStartGame={props.handleStartGame}
        />
      </Modal>

      <Modal
        isOpen={props.showTicTacToeModal}
        onClose={() => props.setShowTicTacToeModal(false)}
        maxWidth="w-full"
      >
        <TicTacToe onClose={() => props.setShowTicTacToeModal(false)} />
      </Modal>

      <Modal
        isOpen={props.showChessModal}
        onClose={() => props.setShowChessModal(false)}
        maxWidth="w-full"
      >
        <ChessGame onClose={() => props.setShowChessModal(false)} />
      </Modal>

      <Modal
        isOpen={props.showMoralStoriesModal}
        onClose={() => props.setShowMoralStoriesModal(false)}
        maxWidth="sm:w-full lg:w-1/2"
      >
        <MoralStories
          onClose={() => props.setShowMoralStoriesModal(false)}
          getStoryMaker={() => {
            props.setShowMoralStoriesModal(false);
            props.setShowStoryMaker(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={props.showThoughtsTopicModal}
        onClose={() => props.setShowThoughtsTopicModal(false)}
        maxWidth="sm:w-full lg:w-1/2"
      >
        <ThoughtsTopic onSelectTopic={props.handleWriteThought} />
      </Modal>

      <Modal
        isOpen={props.showThoughtsModal}
        onClose={() => props.setShowThoughtsModal(false)}
        maxWidth="sm:w-full lg:w-1/2"
      >
        <RichTextEditor selectedTopic={props.selectedTopic} />
      </Modal>

      <Modal
        isOpen={props.showStoryMaker}
        onClose={() => props.setShowStoryMaker(false)}
        maxWidth="w-full lg:w-1/2"
      >
        <StoryMaker />
      </Modal>
    </div>
  );
}

export default ModelWidgets;
