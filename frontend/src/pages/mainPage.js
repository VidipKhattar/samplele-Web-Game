import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import playButton from "../assets/playbutton.svg";
import reloadButton from "../assets/reloadbutton.svg";
import axios from "axios";
import SearchBar from "../components/searchBar";
import Loading from "./loading";
import NoSong from "./noSong";
import { Analytics } from "@vercel/analytics/react";
import CustomModal from "../components/popup";
import infoFa from "../assets/icons8-info.svg";

function MainPage() {
  const [gameInstance, setGameInstance] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingSampler, setIsPlayingSampler] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [originalSongAudio, setOriginalSongAudio] = useState(new Audio());
  const [samplerSongAudio, setSamplerSongAudio] = useState(new Audio());
  const [userAnswer, setUserAnswer] = useState("");
  const [gameAnswer, setGameAnswer] = useState("");
  const [correct, setCorrect] = useState(false);
  const [tryCount, setTryCount] = useState(4);
  const [triedSongs, setTriedSongs] = useState([]);
  const [countdown, setCountdown] = useState("");
  const [jumbledAnswer, setJumbledAnswer] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const storedTries = Cookies.get("tries");
  const storedCorrect = Cookies.get("correct");

  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem("hasSeenInstructions");
    if (!hasSeenInstructions) {
      setModalIsOpen(true);
      localStorage.setItem("hasSeenInstructions", "true");
    }
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  function midnightExpiration() {
    const currentDate = new Date();
    const midnightUTC = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate() + 1,
        0,
        0,
        0
      )
    );
    return midnightUTC;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = midnightExpiration() - now;
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setCountdown(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (storedTries) {
      setTryCount(parseInt(storedTries));
    }
    if (storedCorrect) {
      setCorrect(storedCorrect === "true");
    }
    axios
      .get(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/songposttoday"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/songposttoday"
      )
      .then((res) => {
        const foundSong = res.data;
        if (foundSong) {
          setGameInstance(foundSong);
          setOriginalSongAudio(new Audio(foundSong.sampled_audio));
          setSamplerSongAudio(new Audio(foundSong.sampler_audio));
          setTriedSongs([]);
          setGameAnswer(
            foundSong.sampler_title + "-" + foundSong.sampler_artist
          );
          setJumbledAnswer(jumbleString(foundSong.sampler_title));
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSong = () => {
    if (triedSongs.includes(userAnswer)) {
      setIsRepeat(true);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    } else if (gameAnswer === userAnswer) {
      setIsRepeat(false);
      setCorrect(true);
      handleSamplerButtonClick();
      handleTryCountUpdate(tryCount, "true");
    } else {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
      triedSongs.push(userAnswer);
      setTriedSongs(triedSongs);
      setIsRepeat(false);
      handleTryCountUpdate(tryCount - 1, "false");
    }
    setUserAnswer("");
  };

  const handleTryCountUpdate = (tryCount, correct) => {
    setTryCount(tryCount);
    Cookies.set("tries", tryCount.toString(), {
      expires: midnightExpiration(),
    });
    Cookies.set("correct", correct, { expires: midnightExpiration() });
  };

  const handleSamplerSearchResultsChange = (results) => {
    if (results) {
      setUserAnswer(results.name + "-" + results.artist);
    } else {
      setUserAnswer("");
    }
  };

  const handleOriginalButtonClick = () => {
    if (!isPlayingOriginal) {
      samplerSongAudio.pause();
      setIsPlayingSampler(false);
      originalSongAudio.play();
      setIsPlayingOriginal(true);
      originalSongAudio.onended = () => {
        setIsPlayingOriginal(false);
      };
    } else {
      originalSongAudio.currentTime = 0;
    }
  };

  const handleSamplerButtonClick = () => {
    if (!isPlayingSampler) {
      originalSongAudio.pause();
      setIsPlayingSampler(true);

      samplerSongAudio.play();
      setIsPlayingOriginal(false);

      samplerSongAudio.onended = () => {
        setIsPlayingSampler(false);
      };
    } else {
      samplerSongAudio.currentTime = 0;
    }
  };

  function jumbleString(str) {
    const words = str.split(" ");

    const jumbledWords = words.map((word) => {
      const chars = word.split("");
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      return chars.join("");
    });
    const jumbledStr = jumbledWords.join(" ");
    return jumbledStr;
  }

  if (loading) {
    return <Loading></Loading>;
  } else if (!gameInstance || Object.keys(gameInstance).length === 0) {
    return <NoSong></NoSong>;
  }

  return (
    <div className="inset-0 bg-gradient-to-bl from-blue-400 to-green-500 via-orange-500 animate-gradient-xy min-h-screen lg:justify-center lg:items-center sm:flex sm:justify-center sm:items-center">
      <div className="container mx-auto px-4 text-center">
        <CustomModal isOpen={modalIsOpen} onRequestClose={closeModal} />
        <header className="sm:text-6xl text-2xl font-bold mx-2 pt-2 text-gray-600	">
          samplele
          <Link to="/admin">
            <button>.</button>
          </Link>
          <button onClick={openModal}>
            <img className="" src={infoFa}></img>
          </button>
        </header>
        {tryCount < 4 ||
          (!correct && (
            <h2 className="text-gray-600 font-semibold md:text-lg my-2">
              listen to the sample to try and guess which song samples it.
            </h2>
          ))}
        <h2 className="text-gray-600 text-2xl  sm:my-4 mb-2">
          {tryCount === 0 && !correct && !isRepeat && (
            <span className="animate-pulse text-red-600  ">
              unlucky, try again tomorrow
            </span>
          )}
          {tryCount === 1 && !correct && !isRepeat && (
            <span className="animate-pulse text-red-600  ">
              no more hints, last chance.
            </span>
          )}
          {tryCount === 2 && !correct && !isRepeat && (
            <span className="animate-pulse text-red-600  ">
              not great at this are you.
            </span>
          )}
          {tryCount === 3 && !correct && !isRepeat && (
            <span className="animate-pulse text-red-600 ">try again.</span>
          )}
          {correct && !isRepeat && (
            <span className="animate-pulse text-green-500 duration-2000">
              correct
            </span>
          )}
          {isRepeat && (
            <span className="animate-flash-green text-red-600	duration-2000">
              already tried.
            </span>
          )}
        </h2>

        <div
          className={`container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0  ${
            correct || tryCount < 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
            <SearchBar
              onSearchResultsChange={handleSamplerSearchResultsChange}
              userAnswer={userAnswer}
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg hover:bg-opacity-50 transition-colors duration-300"
                type="button"
                onClick={handleOriginalButtonClick}
              >
                {isPlayingOriginal ? (
                  <img src={reloadButton} alt="Reload" />
                ) : (
                  <img src={playButton} alt="Play" />
                )}
              </button>
              <button
                className={`bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out ${
                  correct ? "bg-green-500" : "bg-opacity-50 bg-blue-500"
                } 
                ${isShaking ? "animate-shake-wrong  bg-red-500" : ""}
                ${
                  !userAnswer && tryCount < 2
                    ? "pointer-events-none opacity-50"
                    : ""
                } 
                backdrop-filter backdrop-blur-lg rounded-xl shadow-lg w-full font-bold text-white`}
                onClick={
                  userAnswer || tryCount < 2
                    ? checkSong
                    : () => setTryCount(tryCount - 1)
                }
                type="button"
              >
                {userAnswer || tryCount < 2 ? "Lock In" : "Hint"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center my-3">
          <div className="flex">
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 1 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 2 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 3 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 4 ? "opacity-50" : ""
              }`}
            ></div>
          </div>
        </div>

        <div className="container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0">
          <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 min-[520px]:grid-cols-2 flex flex-col md:flex-row justify-center items-center">
            <div className="flex justify-center items-center md:block sm:block lg:col-span-1 md:col-span-1 sm:col-span-1 ">
              <div className="relative bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg w-48 h-48 flex justify-center items-center">
                <img
                  src={gameInstance.sampler_artwork}
                  alt="Sampler Artwork"
                  className={`object-cover w-full h-full rounded-3xl ${
                    correct || tryCount < 1
                      ? ""
                      : tryCount < 2
                      ? "blur-md"
                      : tryCount < 3
                      ? "blur-xl"
                      : tryCount < 4
                      ? "blur-2xl"
                      : "blur-2xl"
                  }`}
                />
                {(correct || tryCount === 0) && (
                  <button
                    className="absolute bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-full shadow-lg hover:bg-opacity-55 duration-300 w-16 h-16 flex justify-center items-center"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    type="button"
                    onClick={handleSamplerButtonClick}
                  >
                    {isPlayingSampler ? (
                      <img src={reloadButton} alt="Pause" className="w-8 h-8" />
                    ) : (
                      <img src={playButton} alt="Play" className="w-8 h-8" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="font-bold text-center text-gray-600 sm:pl-4 min-[520px]:text-left lg:col-span-2 md:col-span-2 sm:col-span-2 ">
              <p
                className={`text-2xl pb-2 ${
                  tryCount < 1 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-sm"
                }`}
              >
                {tryCount < 1 || correct ? (
                  <span>{gameInstance.sampler_title}</span>
                ) : (
                  <span>{jumbledAnswer}</span>
                )}
              </p>
              <p
                className={`text-md pb-2 ${
                  tryCount < 2 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-sm"
                }`}
              >
                {gameInstance.sampler_album}
              </p>
              <p
                className={`text-lg pb-2 ${
                  tryCount < 3 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-sm"
                }`}
              >
                {gameInstance.sampler_artist}
              </p>
              <p
                className={`text-sm pb-2 ${
                  tryCount < 4 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-sm"
                }`}
              >
                {gameInstance.sampler_year}
              </p>
            </div>
          </div>
          <div
            className={`${
              correct || tryCount < 1
                ? "opacity-100 transition-opacity duration-500 ease-in"
                : "opacity-0"
            }`}
          >
            <div
              className={`grid grid-cols-4 gap-4 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 my-4 rounded-3xl shadow-lg justify-center items-center`}
            >
              <div className="col-span-1 flex justify-center items-center">
                <button
                  className="absolute bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-full shadow-lg hover:bg-opacity-55 duration-300 w-16 h-16 flex justify-center items-center"
                  type="button"
                  onClick={handleOriginalButtonClick}
                >
                  {isPlayingOriginal ? (
                    <img src={reloadButton} alt="Pause" className="w-8 h-8" />
                  ) : (
                    <img src={playButton} alt="Play" className="w-8 h-8" />
                  )}
                </button>
              </div>
              <div className="col-span-3 font-bold text-center text-gray-600 min-[520px]:text-left">
                <p
                  className={`text-3xl pb-2 ${
                    tryCount < 1 || correct ? "" : "blur-sm"
                  }`}
                >
                  {gameInstance.sampled_title}
                </p>
                <p
                  className={`text-xl pb-2 ${
                    tryCount < 3 || correct ? "" : "blur-sm"
                  }`}
                >
                  {gameInstance.sampled_artist}
                </p>
                <p
                  className={`text-lg pb-2 ${
                    tryCount < 4 || correct ? "" : "blur-sm"
                  }`}
                >
                  {gameInstance.sampled_year}
                </p>
              </div>
            </div>
            <p className="animate-flash-green text-gray-600 font-bold text-lg ">
              come back tomorrow for a new song 👀
            </p>
            <p className="text-gray-600 font-bold text-lg animate-flash-green  ">
              in {countdown}
            </p>
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default MainPage;
