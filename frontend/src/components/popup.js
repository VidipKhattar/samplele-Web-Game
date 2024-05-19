// Modal.js
import React from "react";
import Modal from "react-modal";
import playButton from "../assets/playbutton.svg";
import replayButton from "../assets/reloadbutton.svg";

Modal.setAppElement("#root");

// Modal component
const CustomModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-gradient-to-bl from-green-400 to-blue-500 via-orange-500 animate-gradient-xy rounded-xl p-4 shadow-lg lg:w-1/2 sm:w-5/6 w-5/6 mx-auto mt-10 relative shadow-2xl transform transition-opacity duration-300 ease-in-out"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-0 right-0 m-4 text-white focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="text-center text-gray-600">
        <h2 className="font-bold mb-2">how to play</h2>

        <div className="flex flex-col items-center">
          <p className="text-sm mb-2 sm:mb-0 ">
            Play the Sample: Press the play button to listen to the snippet.
          </p>
          <div className="items-center">
            <div className="flex">
              <img className="w-8 h-8 " src={playButton} alt="Play Button" />
              <img
                className="w-8 h-8 "
                src={replayButton}
                alt="Replay Button"
              />
            </div>
          </div>
        </div>
        <p className="text-sm mt-2 sm:mb-0 ">
          Guess the Sampler Song: Type your guess in the search bar and press
          'lock in' to submit.
        </p>
        <div className="flex justify-center items-center my-3">
          <div className="flex">
            <div className={"w-2 h-2 rounded-full mx-1 bg-gray-600"}></div>
            <div className={"w-2 h-2 rounded-full mx-1 bg-gray-600"}></div>
            <div className={"w-2 h-2 rounded-full mx-1 bg-gray-600"}></div>
            <div
              className={"w-2 h-2 rounded-full mx-1 bg-gray-600 opacity-50"}
            ></div>
          </div>
        </div>
        <p className="mt-4 text-sm">
          Limited Tries: You have 4 attempts. Each incorrect guess reveals more
          song info.
        </p>
        <div className="my-3">
          <button
            className="bg-blue-600 p-1 mr-1 rounded-xl shadow-lg text-white text-sm"
            disabled={true}
          >
            Lock In
          </button>
          <button
            className="bg-blue-600 p-1 ml-1 rounded-xl shadow-lg text-white text-sm"
            disabled={true}
          >
            Hint
          </button>
        </div>

        <p className="text-sm">
          Unlock Hints: The 'lock in' button becomes a 'hint' button if no guess
          is given.
        </p>
        <p className="my-3 text-sm">
          Revealing the Song: After 4 tries or a correct guess, the song sample
          is revealed.
        </p>
        <p className="my-3 text-sm">
          Daily Challenge: Play once a day (for rn), just like Wordle!
        </p>
        <p className="my-3 text-sm">
          For any queries:{" "}
          <a
            className="underline"
            href="mailto:vidipkattar@gmail.com?subject=Feedback&body=Hi%20there,"
          >
            vidipkattar@gmail.com
          </a>
        </p>
      </div>
    </Modal>
  );
};

export default CustomModal;
